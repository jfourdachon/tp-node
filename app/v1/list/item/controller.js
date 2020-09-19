const { to } = require('await-to-js')
const R = require('ramda')

const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')

const getAll = async (req, res) => {
  const { listId } = req.params

  const title = R.path(['query', 'title'])(req)

  const [itemsErr, items] = await to(
    db('item')
      .select()
      .where({ list_id: listId })
      .andWhere((builder) =>
        !R.isNil(title)
          ? builder.where('title', 'like', `%${title}%`)
          : builder,
      ),
  )
  if (!R.isNil(itemsErr)) {
    logger.error(itemsErr)
    return res.status(500).json({ error: `${itemsErr}` })
  }

  return res.status(200).json(items)
}

module.exports = { getAll }
