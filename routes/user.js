const express = require('express')
const router = express.Router()

//controllers
// const userControllers = require('../controllers/user')
const { sayHi } = require('../controllers/user')

router.get('/', sayHi)

module.exports = router;