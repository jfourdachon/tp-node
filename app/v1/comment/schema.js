const Joi = require('joi')

const createSchema = Joi.object({
  content: Joi.string()
    .pattern(/^[0-z\s]+$/)
    .trim()
    .min(1)
    .required(),
})

module.exports = { createSchema }
