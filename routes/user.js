const express = require('express')
const router = express.Router()

const { userById } = require('../controllers/user')

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth')

//when route has 'userId' parameter then execute userById method of user controller.
router.param('userId', userById)
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (request, response) => {
    response.json({
        user: request.profile
    })
})

// router.get('/secret/:userId', requireSignin, userById)


module.exports = router;