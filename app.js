require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

//HTTP request logger middleware, displays routes
//e.g. POST /api/signup 400 46.373 ms - 133
const morgan = require('morgan')
//To parse the form data in body field of request
const bodyParser = require('body-parser')
//To store user credentials in the cookie
const cookieParser = require('cookie-parser')

//import routes
const useRoutes = require('./routes/user')

//app
const app = express()

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Database connected')
})


//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json()) //Returns the json data from the request body
app.use(cookieParser())

//routes middleware
app.use("/api", useRoutes)



const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})