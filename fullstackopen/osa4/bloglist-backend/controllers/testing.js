// Testausta varten tarkoitettu reititin, jolla tyhjennetään testitietokannan blogit ja käyttäjät ennen E2E-testejä
const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Tyhjennetään testitietokannan blogit ja käyttäjät
testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter