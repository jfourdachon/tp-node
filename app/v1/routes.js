const router = require('express').Router()

const user = require('./user/router.js')
const article = require('./article/router.js')
const comment = require('./comment/router.js')
const auth = require('./auth/router.js')

router.use('/user', user)
router.use('/article', article)
router.use('/comment', comment)
router.use('/auth', auth)

module.exports = router
