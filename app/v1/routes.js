const router = require('express').Router()

const list = require('./list/router.js')
const item = require('./item/router.js')

router.use('/list', list)
router.use('/item', item)

module.exports = router
