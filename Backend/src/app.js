require("dotenv").config();
const express = require('express')
const urlRoutes = require('./routes/url.routes')

const app = express()
app.use(express.json())

app.use('/api/url', urlRoutes)


module.exports = app