const express = require('express')
const router = express.Router()

//controllers
const { create, categoryById, read, update, remove, list } = require('../controllers/category')

const {requireSignin, isAuth, isAdmin} = require('../controllers/auth')
const { userById } = require('../controllers/user')

router.param('userId', userById)
router.param('categoryId', categoryById)

router.get('/category/:categoryId', read)
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create)
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update)
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove)
router.get('/categories', list)


module.exports = router;