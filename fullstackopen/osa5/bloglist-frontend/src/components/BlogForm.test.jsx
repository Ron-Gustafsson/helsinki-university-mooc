import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

// 5.16: Testaa, että uuden blogin lomake kutsuu propsina saamaansa funktiota oikeilla tiedoilla
describe('<BlogForm/>', () => {
  test('calls createBlog with correct details when a new blog is created', async () => {
    const user = userEvent.setup()

    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    // Haetaan lomakkeen kentät placeholder-tekstien perusteella
    const titleInput = screen.getByPlaceholderText('enter the blog title')
    const authorInput = screen.getByPlaceholderText('enter the blog writer')
    const urlInput = screen.getByPlaceholderText('enter the blog website')

    const createButton = screen.getByText('create')

    // Kirjoitetaan lomakkeen kenttiin testiarvot
    await user.type(titleInput, 'Testing React components')
    await user.type(authorInput, 'Ron Gustafsson')
    await user.type(urlInput, 'https://testi.com')

    // Lähetetään lomake painamalla create-nappia
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    // Tarkistetaan, että createBlog sai parametrina oikeat blogin tiedot
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Testing React components',
      author: 'Ron Gustafsson',
      url: 'https://testi.com'
    })
  })
})