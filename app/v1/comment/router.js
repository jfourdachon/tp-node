const router = require('express').Router()

const { protect, restrictTo } = require('../middlewares/auth.js')
const controller = require('./controller.js')

router.delete(`/:id`, protect, restrictTo('admin'),controller.deleteComment)

module.exports = router
