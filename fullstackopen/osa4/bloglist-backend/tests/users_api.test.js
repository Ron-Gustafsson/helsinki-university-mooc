// Osa 4: Käyttäjien hallinta testit
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    // Luodaan valmis salasana-hash testikäyttäjälle
    const passwordHash = await bcrypt.hash('sekret', 10)

    // Luodaan testikäyttäjä, joka on kannassa ennen muita testejä
    const user = new User({
      username: 'root',
      name: 'Test User',
      passwordHash,
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'rongu',
      name: 'Ron Gustafsson',
      password: 'salasana1',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    // Käyttäjien määrän pitää kasvaa yhdellä
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    //console.log('usersAtStart:', usersAtStart)
    //console.log('usersAtEnd:', usersAtEnd)

    const usernames = usersAtEnd.map(user => user.username)

    //console.log('usernames:', usernames)
    //console.log('newUser.username:', newUser.username)

    // Uuden käyttäjätunnuksen pitää löytyä tietokannasta
    assert(usernames.includes(newUser.username))
  })

  test('creation fails if username already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Duplicate User',
      password: 'salasana',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    // Username jo käytössä
    assert(result.body.error.includes('expected `username` to be unique'))

    // Käyttäjien määrä ei saa muuttua
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'No Username',
      password: 'salasana',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    // Virheilmoituksen pitää kertoa käyttäjätunnuksen ongelmasta
    assert(result.body.error.includes('username must be at least 3 characters long'))

    // Käyttäjien määrä ei saa muuttua
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Short Username',
      password: 'salasana',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('username must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'no password',
      name: 'No Password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'shortpassword',
      name: 'Short Password',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
//npm test -- --test-only tests/users_api.test.js
//npm test -- tests/users_api.test.js           