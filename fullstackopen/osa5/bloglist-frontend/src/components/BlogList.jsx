import { Link } from 'react-router-dom'

// Näyttää kaikki blogit linkkeinä
const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>

      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            {/* Linkki avaa yksittäisen blogin oman reitin */}
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList