const Joi = require('joi')

const createSchema = Joi.object({
  email: Joi.string()
    .pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .trim()
    .required(),
  username: Joi.string()
    .pattern(/^[0-z\s]+$/)
    .trim()
    .min(3)
    .required(),
  user_password: Joi.string()
    .pattern(/^[0-z]+$/)
    .trim()
    .min(8)
    .required(),
    user_role: Joi.string()
    .default('user')
})

module.exports = { createSchema }