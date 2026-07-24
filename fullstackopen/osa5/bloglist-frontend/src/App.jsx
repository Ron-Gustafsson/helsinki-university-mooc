// Muistiin kun näitäkään ikinä muista: Tiedosto sisältää JavaScriptiä ja JSX:ää.
// JavaScript hoitaa sovelluksen logiikan ja JSX määrittelee käyttöliittymän.

import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogList from './components/BlogList' // 5.25 näyttää blogit linkkeinä
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom' // React router importit -> Router on main.jsx
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm' // blogin lisäys
import './styles.css'
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material' // React-kirjasto MaterialUI: npm install @mui/material @emotion/react @emotion/styled https://fullstackopen.com/osa5/react_router_tyylikirjastot#tehtavat-5-29-5-31

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null) // kirjautuneen käyttäjän tiedot tallennetaan tänne
  const [username, setUsername] = useState('') // lomakkeiden kentät
  const [password, setPassword] = useState('')

  // Notifikaation viesti ja tyyppi
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  // Mahdollistaa siirtymisen toiseen reittiin
  const navigate = useNavigate()

  // Tarkistetaan vastaako osoite yksittäisen blogin url
  const match = useMatch('blogs/:id')

  // Etsitään url-osoitteen id:tä vastaava blogi
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  //5.30: Navigaation hover tyylittely
  const navigationButtonStyle = {
    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    // Hakee local storagesta mahdollisen kirjautuneen käyttäjän
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON) // Muutetaan json-merkkijono takaisin javascrript-olioksi

      setUser(user)

      // Asetetaan token uudelleen blogServiceen reloadin jälkeen
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    // ilmoituksenteksti ja tyyppi
    setNotificationMessage(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const showSuccessMessage = message => {
    showNotification(message, 'success')
  }

  const showErrorMessage = message => {
    showNotification(message, 'error')
  }

  const handleLogin = async event => {
    event.preventDefault() // Estää lomakkeen oletustoiminnon eli uudelleen latauksen
    console.log('logging in with', username) // Muista poistaa ennen github push

    try {
      const user = await loginService.login({ username, password })

      // Tallentaa kirjautuneen käyttäjän selaimen local storageen
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      // Asetetaan token blogServiceen suojattuja pyyntöjä varten
      blogService.setToken(user.token)

      setUser(user) // Tallentaa backendin palauttaman käyttäjäolion tilaan
      // Tyhjennetään lomakkeen kentät onnistuneen kirjautumisen jälkeen
      setUsername('')
      setPassword('')

      //  Siirrytään kirjautumisen jälkeen blogilistaan
      navigate('/')

    } catch {
      showErrorMessage('wrong username or password') // Näytetään virheilmoitus
    }
  }

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value)
  }

  const handlePasswordChange = ({ target }) => {
    setPassword(target.value)
  }

  const handleLogout = () => {
    // Poistetaan kirjautunut käyttäjä selaimen muistista
    window.localStorage.removeItem('loggedBlogappUser')

    // Tyhjennetään token blogService-moduulista
    blogService.setToken(null)

    // Palautetaan sovellus kirjautumattomaan tilaan
    setUser(null)

    // Näytetään uloskirjatumisen jälkeen blogilista
    navigate('/')
  }

  const createBlog = async blogObject => {
    try {
      // Lähettetään uusi blogi backendille
      const returnedBlog = await blogService.create(blogObject)

      // Backend palauttaa user-kentässä vain käyttäjän id:n.
      // Lisätään frontendin tilaan kokonainen käyttäjäolio, jotta nimi ja remove-nappi näkyvät heti.
      const blogWithUser = {
        ...returnedBlog,
        user: {
          id: returnedBlog.user,
          username: user.username,
          name: user.name
        }
      }

      //Lisätään backendin palauttama blogi nykyiseen blogilistaan
      setBlogs(blogs.concat(blogWithUser))

      showSuccessMessage(
        `a new blog ${blogWithUser.title} by ${blogWithUser.author} added`
      )
    } catch {
      showErrorMessage('blog creation failed') //Käyttäjälle virheilmoitus
    }

    // Siirrytään onnistuneen luonnin jälkeen blogilistaan
    navigate('/')
  }

  //5.8: like painikkeen toiminnallisuus
  const handleLike = async (blog) => {
  // Lähetetään backendille pelkkä id > ei koko user olioo
    const userId = blog.user.id || blog.user._id

    const updatedBlog = {
      user: userId,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    // Päivittää ainoastaan liketetyn blogin likes-arvon
    setBlogs(blogs.map(b =>
      b.id !== blog.id ? b : { ...b, likes: returnedBlog.likes }
    ))}

  // 5.10: Blogit likejen mukaisessa suuruusjärjestyksessä
  // tehdään kopio taulukosta ja vertaillaan kahta blogia keskenään
  const blogsByLikes  = [...blogs].sort((firstblog, secondblog) => {
    return secondblog.likes - firstblog.likes
  })

  // 5.11: Poiston tekevä logiikka
  const handleRemoveBlog = async (blog) => {
    // Käyttäjältä varmistus ennen poistoa
    const confirmRemove = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )

    if (!confirmRemove) {
      return
    }

    try {
      await blogService.remove(blog.id)

      // poistetaan blogi frotendin tilasta
      setBlogs(blogs.filter(blogInList => blogInList.id !== blog.id))

      // Siirrytään poiston jälkeen blogilistaan
      navigate('/')
    } catch {
      showErrorMessage('blog removal fail')
    }
  }

  return (
    <Container>
      {/* Navigaatio näkyy kaikissa näkymissä */}
      <AppBar position='static'>
        <Toolbar>
          {/* Sovelluksen nimi */}
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>

          {/* Vie kaikkienb blogien näkymään */}
          <Button
            color='inherit'
            component={Link}
            to='/'
            sx={navigationButtonStyle}
          >
            blogs
          </Button>

          {user === null ? (
            // Tämä suoritetaan jos ei ole kirjautunut
            <Button
              color='inherit'
              component={Link}
              to='/login'
              sx={navigationButtonStyle}
            >
              login
            </Button>
          ) : (
            // Tämä suoritetaan jos on kirjautunut
            <>
              {/* Linkki uuden blogin luontiin */}
              <Button
                color='inherit'
                component={Link}
                to='/create'
                sx={navigationButtonStyle}
              >
                new blog
              </Button>

              <Button
                color='inherit'
                onClick={handleLogout}
                sx={navigationButtonStyle}
              >
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Notification
        message={notificationMessage}
        type={notificationType}
      />

      <Routes>
        {/* Kirjautumisnäkymä */}
        <Route
          path="/login"
          element={
            <div>
              <h2>Log in to application</h2>

              <LoginForm
                username={username}
                password={password}
                handleUsernameChange={handleUsernameChange}
                handlePasswordChange={handlePasswordChange}
                handleLogin={handleLogin}
              />
            </div>
          }
        />

        {/* Uuden blokin luonti näkymä */}
        <Route
          path='/create'
          element={<BlogForm createBlog={createBlog} />}
        />

        {/* Yksittäisen blogin näkymän */}
        <Route
          path='/blogs/:id'
          element={
            <Blog
              blog={blog}
              handleLike={handleLike}
              handleRemoveBlog={handleRemoveBlog}
              user={user}
            />
          }
        />

        {/* Kaikkien blogien näkymä */}
        <Route
          path="/"
          element={
            <BlogList blogs={blogsByLikes} />
          }
        />
      </Routes>
    </Container>
  )
}

export default App