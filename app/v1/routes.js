const router = require('express').Router()

const list = require('./list/router.js')

router.use('/list', list)

module.exports = router
