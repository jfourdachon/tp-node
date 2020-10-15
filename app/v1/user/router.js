const router = require('express').Router()

const { restrictTo, protect } = require('../middlewares/auth.js')
const controller = require('./controller.js')

router.use(protect, restrictTo('admin'))
router.get('/:id', controller.getById)
router.post('/', controller.createUser)
router.put('/:id', controller.updateUser)
router.delete('/:id', controller.deleteUser)

module.exports = router