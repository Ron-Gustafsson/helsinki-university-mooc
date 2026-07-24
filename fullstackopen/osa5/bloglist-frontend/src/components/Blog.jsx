import {
  Button,
  Card,
  CardActions,
  CardContent,
  Link as MuiLink,
  Typography
} from '@mui/material'

// Näyttää yhden blogin kaikki tiedot omalla sivullaan
const Blog = ({ blog, handleLike, handleRemoveBlog, user }) => {
  // Jos blogia ei ole vielä ladattu backendista
  if (!blog) {
    return null
  }

  //Poistonappi näytetään vain kirjautuneelle blogin luojalle
  const showRemoveButton = user && blog.user?.username === user.username

  return (
    // Yksittäisen blogin tyylitelty kortti
    <Card elevation='5' sx={{ mt: 2, maxWidth: 700, borderRadius: 3 }}>
      <CardContent sx={{ pb: 0 }}>
        {/* Blogin otsikko ja kirjoittaja */}
        <Typography variant='h5' component='h2' gutterBottom>
          {blog.title}
        </Typography>

        <Typography variant='body1' sx={{ mb: 1 }}>
          by {blog.author}
        </Typography>

        {/* Blogin verkkosivu */}
        <MuiLink
          href={blog.url}
          target='_blank'
          rel='noreferrer'
        >
          {blog.url}
        </MuiLink>

        {/* Blogin lisännyt käyttäjä */}
        <Typography sx={{ mt: 1 }}>
          added by {blog.user?.name}
        </Typography>
      </CardContent>

      {/* Tykkäykset ja toimintopainikkeet samalla rivillä */}
      <CardActions sx={{ pt: 0, px: 2 }}>
        <Typography sx={{ mr: 1, color: 'green', fontWeight: 'bold' }}>
          likes {blog.likes}
        </Typography>

        {/* Vain kirjautunut käyttäjä voi tykätä */}
        {user && (
          <Button
            type='button'
            variant='outlined'
            onClick={() => handleLike(blog)}
          >
            like
          </Button>
        )}

        {/* Vain blogin lisääjä voi poistaa blogin */}
        {showRemoveButton && (
          <Button
            type='button'
            variant='outlined'
            color='error'
            onClick={() => handleRemoveBlog(blog)}
          >
            remove
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

// Komponentin nimeäminen -> näkyy selkeämmin react devtools
Blog.displayName = 'Individual Blog'

export default Blog