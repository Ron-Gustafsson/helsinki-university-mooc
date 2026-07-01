// Itse toteutettujen middlewarejen määrittely
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Tulostetaan jokaisen pyynnön perustriedot konsoliin
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  

  // 4.16: Virheenkäsittely duplikaateille ja username pitää olla uniikki
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    // Tämä virhe tulee, jos username ei ole uniikki
    return response.status(400).json({
      error: 'expected `username` to be unique',
    })

  } else if (error.name === 'JsonWebTokenError') { 
    return response.status(401).json({ error: 'token missing or invalid' }) // 4.19 Token virheenkäsittely

  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' }) // 4.19 Token vanhentunut
  }

  // Jos virhe ei kuulunut edellisiin siirretään expressille
  next(error)
}

// 4.20: Tokenin erottaminen middlewareksi
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  // Jos Authorization-header alkaa sanalla "bearer ", otetaan token talteen
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

// 4.22: Selvittää pyyntöön liittyvät käyttäjän ja sijoittaa sen request-olioon
const userExtractor = async (request, response, next) => {
  try {
    // Jos token puuttuu, käyttäjää ei voida tunnistaa
    if (!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }

    // Tarkistetaan token ja otetaan siitä käyttäjän id
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    // Haetaan tokenin perusteella kirjautunut käyttäjä
    const user = await User.findById(decodedToken.id)

    if (!user) { // Jos tokenin käyttäjää ei löydy tietokannasta, token ei enää kelpaa
      return response.status(401).json({ error: 'Token not valid' })
    }

    // Lisätään käyttä request olioon reittien käyttöön
    request.user = user

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}