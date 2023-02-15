const express = require('express')
const router = express.Router()

//controllers
// const userControllers = require('../controllers/user')
const { signup } = require('../controllers/user')

//validators
const{ userSignupValidator } = require('../validator')

router.post('/signup', userSignupValidator, signup)

module.exports = router;