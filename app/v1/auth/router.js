const router = require('express').Router()

const controller = require('./controller.js')

router.post('/login', controller.login)
router.post('/signup', controller.signup)

module.exports = router