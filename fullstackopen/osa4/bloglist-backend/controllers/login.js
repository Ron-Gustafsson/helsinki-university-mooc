// 4.18: Token perusteinen kirjautuminen
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()

const User = require('../models/user')

// POST /api/login : kirjautumispyyntö joka tarkistaa käyttäjätunnuksen ja salasanan
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username }) // haetaan käyttäjä db:stä username perusteella
  const passwordCorrect = user === null
    ? false // jos käyttäjää ei löydy salasana ei oikein
    : await bcrypt.compare(password, user.passwordHash) // jos löytyy verrataan salasanaa db Hash-arvoon

  // Jos käyttäjää ei ole tai salasana on väärä -> palautetaan 401 = Unauthorized
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // Tokeniin tallennetaan käyttäjän tunnistamiseen tarvittavat tiedot
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // Luodaan token SECRET-ympäristömuuttujan avulla -> lisätään tokenille voimassa oloaika 1 tunti
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET
    //{ expiresIn: 60*60 }
  )

  // Palautetaan token sekä käyttäjän perustiedot REST Clientille -> osassa 5 FrontEndille
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter