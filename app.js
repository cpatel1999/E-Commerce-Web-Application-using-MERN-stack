require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
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

//routes middleware
app.use("/api", useRoutes)



const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Surver is running on port ${port}`)
})