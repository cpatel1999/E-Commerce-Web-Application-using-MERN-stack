const express = require('express')
const router = express.Router()

const { userById } = require('../controllers/user')

const { requireSignin } = require('../controllers/auth')


router.param('userId', userById)
router.get('/secret/:userId', requireSignin, (request, response) => {
    response.json({
        user: request.profile
    })
})

// router.get('/secret/:userId', requireSignin, userById)


module.exports = router;