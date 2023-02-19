const express = require('express')
const router = express.Router()

//controllers
const { 
    create, listBySearch
} = require('../controllers/product')

const {requireSignin, isAuth, isAdmin} = require('../controllers/auth')
const { userById } = require('../controllers/user')
const { productById, read, remove, update, list, listRelated, listCategories } = require('../controllers/product')

router.param('userId', userById)
router.param('productId', productById)

router.get('/product/:productId', read)
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create)
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove)
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update)
router.get('/products', list)
router.get('/products/related/:productId', listRelated)
router.get('/products/categories', listCategories)
router.post('/products/by/search', listBySearch)

module.exports = router;