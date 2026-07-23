// Näyttää yhden blogin kaikki tiedot omalla sivullaan
const Blog = ({ blog, handleLike, handleRemoveBlog, user }) => {
  // Jos blogia ei ole vielä ladattu backendista
  if (!blog) {
    return null
  }

  //Poistonappi näytetään vain kirjautuneelle blogin luojalle
  const showRemoveButton = user && blog.user?.username === user.username

  return (
    <div className="blog">
      {/* Blogin otsikko ja kirjoittaja */}
      <h2>
        {blog.author}: {blog.title}
      </h2>

      {/* Blogin verkkosivu */}
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>

      {/* Tykkäysten määrä */}
      <div>
        likes {blog.likes} {' '}

        { /* vain kirjautunut käyttäjä voi tykätä */}
        {user && (
          <button
            type= 'button'
            onClick={() => handleLike(blog)}
          >
            like
          </button>
        )}
      </div>

      {/* Blogin lisännyt käyttäjä */}
      <div>added by {blog.user?.name}</div>

      {/* Vain blogin lisääjä voi poistaa blogin */}
      {showRemoveButton && (
        <button
          type="button"
          onClick={() => handleRemoveBlog(blog)}
        >
          remove
        </button>
      )}
    </div>
  )
}

// Komponentin nimeäminen -> näkyy selkeämmin react devtools
Blog.displayName = 'Individual Blog'

export default Blog