const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const cors = require('cors')

// parse json bodies sent by api clients
app.use(express.json())

// api routing for users
const usersRouter = require('./controllers/users')
app.use('/api/user', usersRouter)

// api routing for moviedatabase api
const tvRouter = require('./controllers/tv')
app.use('/api/tv', tvRouter)

// connect to database
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

app.use(cors())

// in production, serve the react-app build to client
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })
}

module.exports = app