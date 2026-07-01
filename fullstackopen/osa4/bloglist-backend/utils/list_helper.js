// 4 a: Sovelluksen rakenne ja testauksen alkeet
// Tehtävä 4.3 testi palauttaa aina 1
const dummy = () => {
  return 1
}

// Tehtävä 4.4 testi totalLikes funktio laskee blogilistan kaikkien arvojen summan
const totalLikes = (blogs) => {
  const sum = blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)

  return sum
}

// Tehtävä 4.5 testi palauttaa blogin, jolla on eniten tykkäyksiä
const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

// Tehtävä 4.6 testi palauttaa kirjoittajan jolla on eniten blogeja
const mostBlogs = (blogs) => {
  const authors = {} // tänne kerätään kirjoittajien blogimäärät

  // käy blogit yksi kerrallaan läpi
  blogs.forEach(blog => {
    const author = blog.author

    // jos kirjoittajaa ei ole authors oliossa -> aloitetaan määrä yhdestä
    if (authors[author] === undefined) {
      authors[author] = 1
    } else {
      //jos kirjoittaja löytyy jo, kasvatetaan blogien määrää yhdellä
      authors[author] +=  1
    }
  })

  // paras tulos tyhjällä arvolla -> let arvo voi muuttua
  let topAuthor = null
  let topBlogs = 0

  // käydään authors-olion kirjoittajat läpi
  for (const author in authors) {
    // jos kirjoittajalla on enemmän blogeja kuin aiemmalla parhaalla -> päivitetään paras kirjoittajat
    if (authors[author] > topBlogs) {
      topAuthor = author
      topBlogs = authors[author]
    }
  }

  return {
    author: topAuthor,
    blogs: topBlogs
  }
}

// Tehtävä 4.7 testi palauttaa kirjoittajan, jonka blogeilla on eniten tykkäyksiä
const mostLikes = (blogs) => {
  const authors = {} // tänne kerätään kirjoittajien tykkäysten määärät

  // käy blogit yksi kerrallaan läpi
  blogs.forEach(blog => {
    const author = blog.author

    // jos kirjoittajaa ei ole vielä authors aloitetaan nollasta
    if (authors[author] === undefined) {
      authors[author] = 0
    }

    // lisätään kirjoittajalle blogin tykkäykset
    authors[author] += blog.likes
  })

  // paras tulos tyhjällä arvolla -> let arvo voi muuttua
  let topAuthor = null
  let topLikes = 0

  // käydään authors-olion kirjoittajat läpi ja etsitään suurin tykkäysmäärä
  for (const author in authors) {
    if (authors[author] > topLikes) {
      topAuthor = author
      topLikes = authors[author]
    }
  }

  return {
    author: topAuthor,
    likes: topLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}