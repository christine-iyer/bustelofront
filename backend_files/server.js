// server.js
const cors = require("cors");
require('dotenv').config()
require('./config/database') // Existing MongoDB connection
const passport = require('./config/passport') // Updated passport config

const express = require('express')
const app = express()

app.use(cors({
  origin: [
    'https://book-app-front-lake.vercel.app',
    'http://localhost:19006',
    'http://localhost:8081'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const PORT = process.env.PORT || 3006

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.data = {}
    next()
})

app.use(logger('dev'))
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'build')))

// Initialize Passport (ADD THIS)
app.use(passport.initialize());

app.use(require('./config/checkToken'))

// Routes
// ADD THIS - Google auth routes
app.use('/api/user', require('./routes/api/user'))
app.use('/api/review', require('./routes/api/review'))
app.use('/api/assets', require('./routes/api/assets'))
app.use('/api/haikus', require('./routes/api/haikus'))
app.use('/api/blahgs', require('./routes/api/blahgs'))
app.use('/api/tosses', require('./routes/api/tosses'))
app.use('/api/bevvies', require('./routes/api/bevvies'))
app.use('/api/strains', require('./routes/api/strains'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})