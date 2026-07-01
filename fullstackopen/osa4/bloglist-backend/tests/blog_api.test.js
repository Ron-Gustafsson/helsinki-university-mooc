// Osa 4 b: tehtävät 4.8-4.14 testit tänne
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test') // after = sulkee tietokannan testien jälkeen - beforeEach = alustaa tietokannan ennen testin suoritusta
const mongoose = require('mongoose')
const supertest = require('supertest') // ei tarvitse erikseen käynnistää palvelinta kuten axios ja tekee testauksesta helpompaa esim expect
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

// 4.23: Käyttäjämalli ja bcrypt käyttöön
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

// Tehtävä 4.8: Tarkistaa GET /api/blogs vastaa statuskoodilla 200 ja Content-Type sisältää application/json
describe('when there is initially some blogs saved', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Luodaan valmis salasana-hash testikäyttäjälle
    const passwordHash = await bcrypt.hash('salasana', 10)

    // Luodaan testikäyttäjä, jolla kirjaudutaan sisään
    const user = new User({
      username: 'root',
      name: 'Test User',
      passwordHash,
    })
    await user.save()

    // Kirjaudutaan sisään ja otetaan token talteen
    const loginToken = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'salasana'
      })

    token = loginToken.body.token

    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // Tehtävä 4.8: Tarkistaa että palautettujen blogien määrä === initialBlogs blogien määrä
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  // Tehtävä 4.9: testi, joka varmistaa että palautettujen blogien identifioivan kentän tulee olla nimeltään id
  describe('viewing blogs', () => {
    test('all blogs have id field instead of _id', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      response.body.forEach(blog => {
        // Jokaisella blogilla pitää olla id-kenttä
        assert(blog.id)

        // _id-kenttää ei pidä näkyä enää API-vastauksessa
        assert.strictEqual(blog._id, undefined)
      })
    })
  })

  //4.10: Testillä lisätään blogeja sovellukseen
  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Testing backend',
        author: 'Ron Gustafsson',
        url: 'http://www.testi.com',
        likes: 100
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // lähetetään kirjautuneen käyttäjän token
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Haetaan blogit oikeasti tietokannasta POST-pyynnön jälkeen
      const blogsAtEnd = await helper.blogsInDb()

      //Blogien määrä pitää kasvaa yhdellä
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)

      // Tarkistetaan että oikea blogi lisättiin
      assert(titles.includes('Testing backend'))
    })

    //4.23: Varmistaa ettei uuden blogin lisäys onnistu ilman tokenia ja palauttaa 401 Unauthorized
    test('blog creation fails with 401 if token is missing', async () => {

      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'Test 401',
        author: 'Ron Gustafsson',
        url: 'http://www.testi.com',
        likes: 100
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      // Haetaan blogit tietokannasta POST-pyynnön jälkeen
      const blogsAtEnd = await helper.blogsInDb()

      //Blogien määrä ei kasva
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

      const titles = blogsAtEnd.map(blog => blog.title)

      // Tarkistetaan että blogia ei löydy tietokannasta
      assert.strictEqual(titles.includes('Test 401'), false)
    })

    // 4.11: Jos kentälle likes ei anneta arvoa asetetaan sen arvoksi 0
    test('blog without likes is saved with likes value 0', async () => {
      const newBlog = {
        title: 'Blog without likes',
        author: 'Ron Gustafsson',
        url: 'http://www.nolikes.com'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // lähetetään kirjautuneen käyttäjän token
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Haetaan blogit oikeasti tietokannasta POST-pyynnön jälkeen
      const blogsAtEnd = await helper.blogsInDb()

      // Etitään juuri lisätty blogi otsikon perusteella
      const addedBlog = blogsAtEnd.find(blog => blog.title === 'Blog without likes')

      // Tarkistetaan että likes arvo on 0
      assert.strictEqual(addedBlog.likes, 0)
    })

    // 4.12: Jos title puuttuu, vastataan statuskoodilla 400
    test('blog without title is not added', async () => {
      const newBlog = {
        author: 'Ron Gustafsson',
        url: 'http://www.notitle.com',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // lähetetään kirjautuneen käyttäjän token
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      // blogien määrä ei saa kasvaa
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    // 4.12: Jos url puuttuu, vastataan statuskoodilla 400
    test('blog without url is not added', async () => {
      const newBlog = {
        title: 'Blog without url',
        author: 'Ron Gustafsson',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // lähetetään kirjautuneen käyttäjän token
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  // 4.13: Testi yksittäisen blogin poistoon -> 4.23 muutos kirjautuneena käyttäjänä, rakenne uusiksi
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb() // Haetaan tietokannan alkutilanne ennen poistoa
      //const blogToDelete = blogsAtStart[0] // Valitaan poistettavaksi listan ensimmäinen blogi

      const newBlog = {
        title: 'Blog to delete',
        author: 'Ron Gustafsson',
        url: 'http://www.delete.com',
        likes: 10
      }

      // Luodaan blogi kirjautuneen käyttäjän tokenilla
      const blogToDelete = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`) // lähetetään kirjautuneen käyttäjän token
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // Poistetaan juuri luotu blogi samalla käyttäjällä
      await api
        .delete(`/api/blogs/${blogToDelete.body.id}`)
        .set('Authorization', `Bearer ${token}`) // lähetetään kirjautuneen käyttäjän token
        .expect(204) // muista 204 = No Content
      
      // Haetaan tietokannan lopputilanne poiston jälkeen
      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(blog => blog.id) // Kerätään jäljelle jääneiden blogien ID:t taulukkoon

      assert(!ids.includes(blogToDelete.body.id)) // Varmistetaan, ettei poistettu blogi ole enää DB

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length) // Varmistetaan, että blogien määrä on sama kuin alussa
    })
  })

  // 4.14: Testi yksittäisen blogin muokkaamiseen -> PUT toimii ilman Authorization tokenia
  describe('updating a blog', () => {
    beforeEach(async () => {
      await Blog.deleteMany({}) // tyhjennetään tietokanta
      await Blog.insertMany(helper.initialBlogs) // lisätään testiblogit, jotta päivitettävä blogi löytyy
    })

    test('blog update success', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      // Uusi tykkäyksien määrä vain kerran
      const newLikes = blogToUpdate.likes + 100

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: newLikes
      }
      
      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // Tarkistetaan, että response sisältää oikeat vanhat kentät
      assert.strictEqual(response.body.title, blogToUpdate.title)
      assert.strictEqual(response.body.author, blogToUpdate.author)
      assert.strictEqual(response.body.url, blogToUpdate.url)
      assert.strictEqual(response.body.likes, newLikes)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find( blog => blog.id === blogToUpdate.id)

      assert.strictEqual(updatedBlogInDb.likes, newLikes)
    })
  })
})

// Testien jälkeen sulkee MongoDB yhteyden
after(async () => {
  await mongoose.connection.close()
})

// tämä tiedosto: test.only: npm test -- --test-only tests/blog_api.test.js
// npm test -- --test-only suorittaa only testit
// npm test -- tests/blog_api.test.js suorittaa tiedoston testit
// npm test -- --test-name-pattern="blogs are returned as json" suorittaa testitnimen perusteella
// npm run test -- --test-name-pattern="notes" suorittaa kaikki testit, joiden nimessä on sana notes