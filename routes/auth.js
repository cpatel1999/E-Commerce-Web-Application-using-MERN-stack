const express = require('express')
const router = express.Router()

//controllers
// const userControllers = require('../controllers/user')
const { 
    signup,
    signin, 
    signout, 
    requireSignin 
} = require('../controllers/auth')

//validators
const{ userSignupValidator } = require('../validator')

router.post('/signup', userSignupValidator, signup)
router.post('/signin', signin)
router.get('/signout', signout)


//checks routes authorization
router.get('/hello', requireSignin, (request, response) => {
    response.send('Hello There!')
})

module.exports = router;