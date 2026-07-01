const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// GET /api/users
// Haetaan kaikki käyttäjät tietokannasta
usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 }) // käyttäjän blogit näkyviin
    response.json(users)

  } catch (error) {
    next(error)
  }
})

// POST /api/users
// Luodaan uusi käyttäjä
usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    // 4.16: Tarkistetaan käyttäjätunnus ennen tietokantaan tallentamista
    if (!username || username.length < 3) {
      return response.status(400).json({
        error: 'username must be at least 3 characters long',
      })
    }

    // 4.16: Tarkistetaan salasana ennen hashin tekemistä
    if (!password || password.length < 3) {
      return response.status(400).json({
        error: 'password must be at least 3 characters long',
      })
    }

    const saltRounds = 10 // kuinka vahvasti salasana hashataan
    const passwordHash = await bcrypt.hash(password, saltRounds) // muutetaan salasana hash ennen DB tallentamista 

    // Luodaan uusi User DB tallennusta varten
    const user = new User({
      username,
      name,
      passwordHash,
    })

    // Tallennetaan käyttäjä DB
    const savedUser = await user.save()

    response.status(201).json(savedUser) // Palautetaan luotu käyttäjä 201 Created
  } catch (error) { // Esimerkiksi duplikaatit virheisiin
    next(error)
  }
})

module.exports = usersRouter // app.js käyttöön
// npm test -- tests/users_api.test.js