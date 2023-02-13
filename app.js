require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', (request, response) => {
    response.send("Hello From Node")
})

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})