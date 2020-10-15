const { default: to } = require('await-to-js');
const jwt = require('jsonwebtoken');
const R = require('ramda');
const { promisify } = require('util');
const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js')

const protect = async (req, res, next) => {
  // check token
  if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
    return res.status(401).json({error: 'You are not logged in! Please login to get access.'})
  }
  const token = req.headers.authorization.split(' ')[1].toString();

  const decodedToken = await promisify(jwt.verify)(
    token,
    `${process.env.APP_JWT_SECRET}`
  );

  // find user in db
  const [userError, user] = await to(db('users').select().where({ id: decodedToken.id }))
    if (!R.isNil(userError)) {
      logger.error(`${userError}`)
      return res.status(500).json({ error: `${userError}` })
    }
  
    if (R.isEmpty(user)) {
      const error = `'The user belongnig to this token does no longer exist.',`
      logger.error(error)
      return res.status(400).json({ error })
    }
    // put user in request
    req.user = user[0];
    next();
}

const isAuthor = async (req, res, next) => {
  const {id} = req.params;
  const [articleErr, article] = await to(db('article').select().where({ id }))
  if (!R.isNil(articleErr)) {
    logger.error(`${articleErr}`)
    return res.status(500).json({ error: `${articleErr}` })
  }

  if (R.isEmpty(article)) {
    const error = `No article for id ${id}`
    logger.error(error)
    return res.status(400).json({ error })
  }

  if (req.user.id !== article[0].author_id) {
    return res.status(500).json({ error: 'only the author is allowed to update this article.' })
  }
  next();
}

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']
    if (!roles.includes(req.user.user_role)) {
      return res.status(403).json({error: 'You do not have permission to perform this action'})
    }
    next();
  };
};

module.exports = { protect, restrictTo, isAuthor}