import { useState, useEffect, useRef } from 'react' // 5.5 lisätty useRef
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm' // blogin lisäys
import Togglable from './components/Togglable' // create new blog-napin toiminta
import './styles.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null) // kirjautuneen käyttäjän tiedot tallennetaan tänne
  const [username, setUsername] = useState('') // lomakkeiden kentät
  const [password, setPassword] = useState('')

  // Notifikaation viesti ja tyyppi
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  // Viite Togglable-komponenttiin
  const blogFormRef = useRef()

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
    console.log('logging in with', username, password) // Muista poistaa ennen github push

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

      // Suljetaan blogin luontilomake onnistuneen lisäyksen jälkeen
      blogFormRef.current.toggleVisibility()

      showSuccessMessage(
        `a new blog ${blogWithUser.title} by ${blogWithUser.author} added`
      )
    } catch {
      showErrorMessage('blog creation failed') //Käyttäjälle virheilmoitus
    }
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
    } catch {
      showErrorMessage('blog removal fail')
    }
  }

  // Jos käyttäjä ei ole kirjautunut
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification
          message={notificationMessage}
          type={notificationType}
        />

        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification
        message={notificationMessage}
        type={notificationType}
      />

      <p>
        <b>{user.name}</b> logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      <br/>

      {blogsByLikes.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleRemoveBlog={handleRemoveBlog}
          user={user} /* Tämä tarvitaan, jotta blog.jsx voi tarkistaa onko blogi kirjautuneen käyttäjän lisäämä */
        />
      )}
    </div>
  )
}

export default App