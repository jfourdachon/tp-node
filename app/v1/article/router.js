const router = require('express').Router()

const controller = require('./controller.js')
const commentRouter = require('./comment/router.js')
const { protect, restrictTo, isAuthor } = require('../middlewares/auth.js')

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.use(commentRouter)

router.use(protect)
router.post('/', controller.createArticle)
router.put('/:id', isAuthor, controller.updateArticle)
router.delete('/:id', restrictTo('admin'), controller.deleteArticle)

module.exports = router
