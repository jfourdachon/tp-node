const Joi = require('joi')

const createSchema = Joi.object({
  email: Joi.string()
    .pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .trim()
    .unique()
    .required(),
  password: Joi.string()
    .pattern(/^[0-z]+$/)
    .trim()
    .min(8)
    .required(),
})

module.exports = { createSchema }