const { to } = require('await-to-js')
const R = require('ramda')

const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')

const deleteComment = async (req, res) => {
  const { id } = req.params

  const [commentErr, comment] = await to(
    db('comment').del().where({ id }).returning('*'),
  )
  if (!R.isNil(commentErr)) {
    logger.error(commentErr)
    return res.status(500).json({ error: `${commentErr}` })
  }

  if (R.isEmpty(comment)) {
    const error = `No comment for id ${id}`
    logger.error(error)
    return res.status(500).json({ error })
  }

  return res.status(200).json(comment[0])
}

module.exports = { deleteComment }
