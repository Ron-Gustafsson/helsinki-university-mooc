// sisältää blogireitit: Router middleware jonne reitit määritellään
const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const middleware = require('../utils/middleware')                                                                                                

// tarkoittaa käytännössä GET /api/blogs eli haetaan kaikki blogit
blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 }) // 4.17: näytetään blogin lisännyt käyttäjä
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

// uuden blogin lisäys MongoDB-tietokantaan -> 4.22 muutos middleware käyttöön
blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    const body = request.body

    // Käyttäjä on haettu valmiiks userExtractopr middlewaressa
    const user = request.user

    // luodaan uusi blogi MongoDB:lle
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id // Tallenetaan blogiin käyttäjän id
    })

    // tallennetaan blogi tietokantaan
    const savedBlog = await blog.save()

    // tallennetaan käyttäjän blogs-taulukkoon uudern blogin id
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})


// blogin hakeminen id:llä
blogsRouter.get('/:id', async (request, response, next) => {
  try {
    // haetaan blogi id perusteella
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next (error)
  }
})

// 4.13: yksittäisen blogin poisto mahdollisuus id:n perusteella -> muutos 4.21: blogin poisto sallitaan vain blogin lisänneelle käyttäjälle
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    // Käyttäjä on haettu valmiiks userExtractopr middlewaressa
    const user = request.user

    // Haetaan poistettava blogi ensin -> nähdään lisääjä
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end() // 404 blogia/sivua ei löydy
    }

    // blog.user on Mongoosen ObjectId, joten se pitää muuttaa merkkijonoksi
    if (!blog.user || blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete this blog' }) // 403 forbidden -> palvelin kieltäytyy lataamasta
    }

    // poisto tehdään vasta kun käyttäjä tarkistettu
    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// 4.14: yksittäisen blogin muokkaustoiminto
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end() // 404 = Not Found
    }

    // päivitetään blogin kentät
    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    // Tallennetaan päivitetty blogi
    const updatedBlog = await blog.save()
    response.json(updatedBlog) // palautetaan päivitetty blogi
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter