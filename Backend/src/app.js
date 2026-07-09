require("dotenv").config();
const express = require('express')
const urlRoutes = require('./routes/url.routes')
const errorHandler = require('./middlewares/error.middleware')


const app = express()
app.use(express.json())

app.use('/api/url', urlRoutes)

//error middleware
app.use(errorHandler)

module.exports = app