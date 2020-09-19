const router = require('express').Router()

const controller = require('./controller.js')

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', controller.createList)
router.put('/:id', controller.updateList)
router.delete('/:id', controller.deleteList)

module.exports = router
