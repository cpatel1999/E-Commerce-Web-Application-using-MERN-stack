require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

//app
const app = express()

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Database connected')
})

//routes
app.get('/', (request, response) => {
    response.send("Hello From Node")
})

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Surver is running on port ${port}`)
})