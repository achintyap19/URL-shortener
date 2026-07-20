require("dotenv").config();
const express = require('express')
const urlRoutes = require('./routes/url.routes')
const errorHandler = require('./middlewares/error.middleware')
const healthRoutes = require('./routes/health.routes')
const morgan = require('morgan')


const app = express()
app.use(express.json())

//middleware for Structured logging eg: 302,12ms
app.use(morgan('dev'));

app.use('/api/url', urlRoutes)
app.use('/health', healthRoutes)

//error middleware
app.use(errorHandler)

module.exports = app