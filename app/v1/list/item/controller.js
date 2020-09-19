const { to } = require('await-to-js')
const R = require('ramda')

const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')
const { createSchema } = require.main.require('./app/v1/item/schema.js')

const getAll = async (req, res) => {
  const { listId } = req.params

  const [itemsErr, items] = await to(
    db('item')
      .select()
      .where({ list_id: listId })
      .andWhere((builder) => {
        const { title, done } = req.query

        if (!R.isNil(title)) {
          builder.where('title', 'like', `%${title}%`)
        }

        if (!R.isNil(done)) {
          builder.where('done', done)
        }

        return builder
      }),
  )
  if (!R.isNil(itemsErr)) {
    logger.error(itemsErr)
    return res.status(500).json({ error: `${itemsErr}` })
  }

  return res.status(200).json(items)
}

const createItem = async (req, res) => {
  const { listId } = req.params

  // Validate input with Joi schema
  const { error: schemaErr, value: body } = createSchema.validate(req.body)
  if (!R.isNil(schemaErr)) {
    const error = `Error in input (err: ${schemaErr})`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [itemErr, item] = await to(
    db('item')
      .insert({ ...body, list_id: listId })
      .returning('*'),
  )
  if (!R.isNil(itemErr)) {
    logger.error(itemErr)
    return res.status(500).json({ error: `${itemErr}` })
  }

  if (R.isEmpty(item)) {
    const error = 'No row written'
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(item[0])
}

module.exports = { getAll, createItem }
