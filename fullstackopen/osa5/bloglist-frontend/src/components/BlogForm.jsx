// Komponentti vastaa uuden blogin luontilomakkeesta
import { useState } from 'react'
import { TextField, Button } from '@mui/material'

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
          <TextField
            label='title'
            name='title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='enter the blog title'
            size='small'
            sx={{ width: 250, mb: 1 }}
          />
        </div>

        <div>
          <TextField
            label='author'
            name='author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='enter the blog author'
            size='small'
            sx={{ width: 250, mb: 1 }}
          />
        </div>

        <div>
          <TextField
            label='url'
            name='url'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder='enter the blog website'
            size='small'
            sx={{ width: 250 }}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 1 }}
        >
            create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm