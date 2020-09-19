const router = require('express').Router()

const controller = require('./controller.js')

// Express does not resolve params with use so we have to explicitly tell the full route here
const baseRoute = '/:listId/item'

router.get(`${baseRoute}/`, controller.getAll)
router.post(`${baseRoute}/`, controller.createItem)

module.exports = router
