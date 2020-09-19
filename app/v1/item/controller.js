const { to } = require('await-to-js')
const R = require('ramda')

const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')
const { createSchema } = require('./schema.js')

const updateItem = async (req, res) => {
  const { id } = req.params

  // Validate input with Joi schema
  const { error: schemaErr, value: body } = createSchema.validate(req.body)
  if (!R.isNil(schemaErr)) {
    const error = `Error in input (err: ${schemaErr})`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [itemErr, item] = await to(
    db('item')
      .update({ ...body, updated_at: new Date() })
      .where({ id })
      .returning('*'),
  )
  if (!R.isNil(itemErr)) {
    logger.error(itemErr)
    return res.status(500).json({ error: `${itemErr}` })
  }

  if (R.isEmpty(item)) {
    const error = `No item for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(item[0])
}

const checkItem = async (req, res) => {
  const { id } = req.params

  const [itemErr, item] = await to(db('item').select(['done']).where({ id }))
  if (!R.isNil(itemErr)) {
    logger.error(itemErr)
    return res.status(500).json({ error: `${itemErr}` })
  }

  if (R.isEmpty(item)) {
    const error = `No item for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  const [itemUpdateErr, itemUpdate] = await to(
    db('item')
      .update({ done: !R.path([0, 'done'])(item), updated_at: new Date() })
      .where({ id })
      .returning('*'),
  )
  if (!R.isNil(itemUpdateErr)) {
    logger.error(itemUpdateErr)
    return res.status(500).json({ error: `${itemUpdateErr}` })
  }

  return res.status(200).json(itemUpdate[0])
}

const deleteItem = async (req, res) => {
  const { id } = req.params

  const [itemErr, item] = await to(
    db('item').del().where({ id }).returning('*'),
  )
  if (!R.isNil(itemErr)) {
    logger.error(itemErr)
    return res.status(500).json({ error: `${itemErr}` })
  }

  if (R.isEmpty(item)) {
    const error = `No item for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(item[0])
}

module.exports = { updateItem, checkItem, deleteItem }
