// 4 a: Sovelluksen rakenne ja testauksen alkeet
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

// 4.3 testi palauttaa aina 1
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

// 4.4 testi totalLikes funktio laskee blogilistan kaikkien arvojen summan
describe('total likes', () => {
  const emptyList = []

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  // jos lista on tyhjä pitää palauttaa 0
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  // jos listassa on yksi blogi pitää palauttaa sen likes arvo
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  // jos listassa on montota blogia pitää palauttaa kaikkien blogien likes arvojen summa
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

// 4.5 testi palauttaa blogin, jolla eniten tykkäyksiä
describe('favorite blog', () => {
  test('blog has most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    const expected = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }

    assert.deepStrictEqual(result, expected)
  })
})

// 4.6 kirjoittaja (author) jolla eniten blogeja
describe('most blogs', () => {
  test('author with most blogs is returned', () => {
    const result = listHelper.mostBlogs(blogs)

    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    assert.deepStrictEqual(result, expected)
  })
})

// 4.7 kirjoittaja (author) jonka blogeilla eniten tykkäyksiä
describe('most likes', () => {
  test('author with most likes is returned', () => {
    const result = listHelper.mostLikes(blogs)

    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    assert.deepStrictEqual(result, expected)
  })
})