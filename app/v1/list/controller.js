const { to } = require('await-to-js')
const R = require('ramda')

const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')

const getAll = async (req, res) => {
  const title = R.path(['query', 'title'])(req)

  const [listErr, list] = await to(
    db('list')
      .select()
      .where((builder) =>
        !R.isNil(title)
          ? builder.where('title', 'like', `%${title}%`)
          : builder,
      ),
  )
  if (!R.isNil(listErr)) {
    logger.info(listErr)
    return res.status(500).json({ error: `${listErr}` })
  }

  return res.status(200).json(list)
}

module.exports = { getAll }
