const { default: to } = require('await-to-js');
const jwt = require('jsonwebtoken');
const R = require('ramda');
var bcrypt = require('bcryptjs');
const { createUser } = require('../user/controller');
const db = require.main.require('./helpers/db.js')
const logger = require.main.require('./helpers/logger.js');
const { promisify } = require('util');


const signup = async (req, res) => {
  const {email} = req.body;

  const [_, user] = await to(db('users').select().where({ email }))
  if (!R.isNil(user[0])) {
    return res.status(500).json({ error: `user with email already exists` })
  }
  await createUser(req, res);
}

const login = async(req, res) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({status: 'failed', message:'Please provide email and password!'});
  }
  const [userError, user] = await to(db('users').select().where({ email }))
  if (!R.isNil(userError)) {
    logger.error(`${userError}`)
    return res.status(500).json({ error: `${userError}` })
  }

  if (R.isEmpty(user)) {
    const error = `No user for email ${email}`
    logger.error(error)
    return res.status(400).json({ error })
  }

  const validPassword = bcrypt.compare(password, user[0].user_password);
  if (!validPassword) {
    return res.status(500).json({ error: 'incorrect email or password' })
  }

  const token = jwt.sign({ id: user[0].id }, `${process.env.APP_JWT_SECRET}`, {
    expiresIn: "30d"
  });

  // delete password in response
  delete user[0].user_password;

  return res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}

module.exports = { signup, login }
