const router = require('express').Router()

const controller = require('./controller.js')

router.put(`/:id`, controller.updateItem)
router.put(`/:id/check`, controller.checkItem)
router.delete(`/:id`, controller.deleteItem)

module.exports = router
