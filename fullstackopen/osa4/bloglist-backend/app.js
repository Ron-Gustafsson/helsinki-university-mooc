// App muodostaa sovelluksen ja tietokantayhteyden
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

// Ohittaa ärsyttävän favicon-pyynnön
app.get('/favicon.ico', (req, res) => res.status(204).end())

logger.info('connecting to MongoDB...')

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor) // 4.20: poimii tokenin Authorization-headerista                                                                     

app.use('/api/blogs', blogsRouter) // Blogien reitit
app.use('/api/users', usersRouter) // Käyttäjien reitit
app.use('/api/login', loginRouter) // Token perusteinen kirjautuminen

// Testitietokannan tyhjennysreitti otetaan käyttöön vain testitilassa
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
