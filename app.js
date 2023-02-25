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
//To perform the validation while providing user information during signup
const expressValidator = require('express-validator')
//For communication between front end and back end, as front end app is on port 3001 and backend app is on port 8000
const cors = require('cors')

//import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')

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
app.use(expressValidator())
app.use(cors())

//routes middleware
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)



const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})