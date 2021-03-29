const express = require('express')
const router = express.Router()
const { create, login, findAll, findOne } = require('../app/controllers/UserController')

// middlewares
const validateUser = require('../app/middlewares/validators/user/validateUser')

/**
 *  Main routes 
 * **/

/* CREATE user. */
router.post('/create', validateUser, create)
/* LOGIN user. */
router.post('/login', login)
/* GET users listing. */
router.get('/fetch', findAll)
/* GET a user. */
router.get('/get', findOne)

module.exports = router
