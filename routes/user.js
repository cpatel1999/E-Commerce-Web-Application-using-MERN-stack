const express = require('express')
const router = express.Router()

router.get('/', (request, response) => {
    response.send("Hello From Node")
})

module.exports = router;