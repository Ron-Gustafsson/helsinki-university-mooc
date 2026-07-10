// Komponentti vastaa uuden blogin luontilomakkeesta
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  // Lomakkeen kenttien arvot pysyvät komeponentin omassa tilassa
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault() // uudelleen lataus esto

    // Lähetetään uuden blogin tiedot App:lle
    createBlog({
      title,
      author,
      url,
    })

    // Tyhjennetään lomake onnistuneen lähetyksen jälkeen
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            name='title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='enter the blog title'
          />
        </div>

        <div>
          author:
          <input
            name='author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='enter the blog writer'
          />
        </div>

        <div>
          url:
          <input
            name='url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder='enter the blog website'
          />
        </div>

        <br/>
        <button type="submit">create</button>
        <br/>
      </form>
    </div>
  )
}

export default BlogForm