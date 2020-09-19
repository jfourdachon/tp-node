const { to } = require('await-to-js')
const R = require('ramda')

const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')

const getAll = async (req, res) => {
  const title = R.path(['query', 'title'])(req)

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
  const id = R.path(['params', 'id'])(req)
  if (R.isNil(id)) {
    const error = 'Id not found'
    logger.error(error)
    return res.status(400).json({ error })
  }

  const [listErr, list] = await to(db('vw_list').select().where({ id }))
  if (!R.isNil(listErr)) {
    logger.error(`${listErr}`)
    return res.status(500).json({ error: `${listErr}` })
  }

  const [itemsErr, items] = await to(db('item').select().where({ list_id: id }))
  if (!R.isNil(itemsErr)) {
    logger.error(`${itemsErr}`)
    return res.status(500).json({ error: `${itemsErr}` })
  }

  if (!R.length(list)) {
    const error = `No list for id ${id}`
    logger.error(error)
    return res.status(400).json({ error })
  }

  return res.status(200).json({ ...list[0], items })
}

module.exports = { getAll, getById }
