// Yksittäisen blogin näyttävä komponentti
import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemoveBlog, user }) => {
  // Kontrolloi näytetäänkö blogin lisätiedot
  const [showDetails, setShowDetails] = useState(false)

  // Vaihtaa lisätiedot näkyviin/piiloon
  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  //Poistonappi näytetään vain blogin lisänneelle käyttäjälle
  const showRemoveButton = blog.user?.username === user.username

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button type='button' onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <div>{blog.url}</div>

          <div>
            likes {blog.likes}
            <button type='button' onClick={() => handleLike(blog)}>
              like
            </button>
          </div>

          <div>{blog.user?.name}</div>

          {showRemoveButton && (
            <button type='button' onClick={() => handleRemoveBlog(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Komponentin nimeäminen -> näkyy selkeämmin react devtools
Blog.displayName = 'Individual Blog'

export default Blog