const router = require('express').Router()

const controller = require('./controller.js')

router.get('/', controller.getAll)
router.get('/:id', controller.getById)

module.exports = router
