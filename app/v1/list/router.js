const router = require('express').Router()

const controller = require('./controller.js')
const itemRouter = require('./item/router.js')

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', controller.createList)
router.put('/:id', controller.updateList)
router.delete('/:id', controller.deleteList)
router.use(itemRouter)

module.exports = router
