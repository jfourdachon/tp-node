const { to } = require('await-to-js')
const R = require('ramda')
var bcrypt = require('bcryptjs');
const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')
const { createSchema } = require('./schema.js')

const getById = async (req, res) => {
  const { id } = req.params

  const [userError, user] = await to(db('users').select().where({ id }))
  if (!R.isNil(userError)) {
    logger.error(`${userError}`)
    return res.status(500).json({ error: `${userError}` })
  }

  if (R.isEmpty(user)) {
    const error = `No user for id ${id}`
    logger.error(error)
    return res.status(400).json({ error })
  }

  return res.status(200).json({ user })
}

const createUser = async (req, res) => {
  // Validate input with Joi schema
  const { error: schemaErr, value: body } = createSchema.validate(req.body)
  if (!R.isNil(schemaErr)) {
    const error = `Error in input (err: ${schemaErr})`
    logger.error(error)
    return res.status(400).json({ error })
  }
  body.user_password = await bcrypt.hash(body.user_password, 10);
  const [userErr, user] = await to(db('users').insert(body).returning('*'))
  if (!R.isNil(userErr)) {
    logger.error(`${userErr}`)
    return res.status(500).json({ error: `${userErr}` })
  }

  if (R.isEmpty(user)) {
    const error = 'No row written'
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(user[0])
}

const updateUser = async (req, res) => {
  const { id } = req.params

  // Validate input with Joi schema
  const { error: schemaErr, value: body } = createSchema.validate(req.body)
  if (!R.isNil(schemaErr)) {
    const error = `Error in input (err: ${schemaErr})`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [userErr, user] = await to(
    db('users')
      .update({ ...body, updated_at: new Date() })
      .where({ id })
      .returning('*'),
  )
  if (!R.isNil(userErr)) {
    logger.error(`${userErr}`)
    return res.status(500).json({ error: `${userErr}` })
  }

  if (R.isEmpty(user)) {
    const error = `No user for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(user[0])
}

const deleteUser = async (req, res) => {
  const { id } = req.params

  const [userErr, user] = await to(
    db('users').del().where({ id }).returning('*'),
  )
  if (!R.isNil(userErr)) {
    logger.error(`${userErr}`)
    return res.status(500).json({ error: `${userErr}` })
  }

  if (R.isEmpty(user)) {
    const error = `No user for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(user[0])
}

module.exports = { getById, createUser, updateUser, deleteUser }
