const { to } = require('await-to-js')
const R = require('ramda')

const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')
const { createSchema } = require('./schema.js')

const getAll = async (req, res) => {
  const { title } = req.query

  const [listErr, list] = await to(
    db('vw_list')
      .select()
      .where((builder) =>
        !R.isNil(title)
          ? builder.where('title', 'like', `%${title}%`)
          : builder,
      ),
  )
  if (!R.isNil(listErr)) {
    logger.error(listErr)
    return res.status(500).json({ error: `${listErr}` })
  }

  return res.status(200).json(list)
}

const getById = async (req, res) => {
  const { id } = req.params

  const [listErr, list] = await to(db('vw_list').select().where({ id }))
  if (!R.isNil(listErr)) {
    logger.error(`${listErr}`)
    return res.status(500).json({ error: `${listErr}` })
  }

  if (R.isEmpty(list)) {
    const error = `No list for id ${id}`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [itemsErr, items] = await to(db('item').select().where({ list_id: id }))
  if (!R.isNil(itemsErr)) {
    logger.error(`${itemsErr}`)
    return res.status(500).json({ error: `${itemsErr}` })
  }

  return res.status(200).json({ ...list[0], items })
}

const createList = async (req, res) => {
  // Validate input with Joi schema
  const { error: schemaErr, value: body } = createSchema.validate(req.body)
  if (!R.isNil(schemaErr)) {
    const error = `Error in input (err: ${schemaErr})`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [listErr, list] = await to(db('list').insert(body).returning('*'))
  if (!R.isNil(listErr)) {
    logger.error(`${listErr}`)
    return res.status(500).json({ error: `${listErr}` })
  }

  if (R.isEmpty(list)) {
    const error = 'No row written'
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(list[0])
}

const updateList = async (req, res) => {
  const { id } = req.params

  // Validate input with Joi schema
  const { error: schemaErr, value: body } = createSchema.validate(req.body)
  if (!R.isNil(schemaErr)) {
    const error = `Error in input (err: ${schemaErr})`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [listErr, list] = await to(
    db('list')
      .update({ ...body, updated_at: new Date() })
      .where({ id })
      .returning('*'),
  )
  if (!R.isNil(listErr)) {
    logger.error(`${listErr}`)
    return res.status(500).json({ error: `${listErr}` })
  }

  if (R.isEmpty(list)) {
    const error = `No list for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(list[0])
}

const deleteList = async (req, res) => {
  const { id } = req.params

  const [listErr, list] = await to(
    db('list').del().where({ id }).returning('*'),
  )
  if (!R.isNil(listErr)) {
    logger.error(`${listErr}`)
    return res.status(500).json({ error: `${listErr}` })
  }

  if (R.isEmpty(list)) {
    const error = `No list for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(list[0])
}

module.exports = { getAll, getById, createList, updateList, deleteList }
