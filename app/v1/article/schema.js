const Joi = require('joi')

const createSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[0-z\s]+$/)
    .trim()
    .min(1)
    .required(),
  content: Joi.string()
    .pattern(/^[0-z\s]+$/)
    .trim()
    .min(1)
    .required(),
  author_id: Joi.number()
    .required(),
});
const updateSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[0-z\s]+$/)
    .trim()
    .min(1),
  content: Joi.string()
    .pattern(/^[0-z\s]+$/)
    .trim()
    .min(1),
})

module.exports = { createSchema, updateSchema }
