const express = require('express')
const router = express.Router()

//controllers
const { 
    create
} = require('../controllers/product')

const {requireSignin, isAuth, isAdmin} = require('../controllers/auth')
const { userById } = require('../controllers/user')

router.param('userId', userById)
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create)


module.exports = router;