import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // mahdollistaa nappien painelun
import Blog from './Blog'
import { describe, expect, test, vi } from 'vitest' // Testi menee läpi ilman näitäkin, mutta problems valittaa virheistä

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Ron Gustafsson',
  url: 'https://testi.com',
  likes: 1,
  user: {
    username: 'testuser',
    name: 'Test User'
  }
}

// Blog-komponentti tarvitsee myös kirjautuneen käyttäjän tiedon -> annetaan eri käyttjä
const loggedUser = {
  username: 'otheruser',
  name: 'Other User'
}

describe('<Blog />', () => {
  // 5.13: Testaa, että Blog-komponentti renderöi blogin titlen
  test('renders title', () => {
    render(<Blog blog={blog} user={loggedUser} />) //  renderöi komponentin React Testing Library ‑kirjaston tarjoaman funktion render avulla

    //screen.debug() //tulostaa komponentin tuottaman html:n

    // Haetaan blogin title renderöidystä komponentista
    const element = screen.getByText(blog.title, { exact: false }) //// exact: false sallii sen, että samassa elementissä on myös muuta tekstiä div sisällä

    //screen.debug(element)

    // Tarkistetaan, että title löytyi
    expect(element).toBeDefined()
  })

  // 5.14: Testaa, että lisätiedot näkyvät view-napin painamisen jälkeen
  test('shows url, likes and user when view button is clicked', async () => {
    render(<Blog blog={blog} user={loggedUser} />) //  renderöi komponentin React Testing Library ‑kirjaston tarjoaman funktion render avulla

    const user = userEvent.setup() // aloittaa uuden session ja simuloi käyttäjän toimintaa selaimessa

    // Hakee komponentista napin tekstin perusteella ja klikkaa sitä
    const button = screen.getByText('view')
    await user.click(button)

    // Tarkistetaan että lisätiedot näkyvät ruudulla eli näkymättömäksi tekevää tyyliä ei enää ole
    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`likes ${blog.likes}`, { exact: false })).toBeVisible() // saa olla myös like nappi
    expect(screen.getByText(blog.user.name)).toBeVisible()
  })

  // 5.15: testi, joka varmistaa, että jos komponentin like-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa
  test('clicking the button 2 times calls event handler two times', async () => {
    // Mock-funktio, jonka kutsujen määrän voi tarkistaa
    const mockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        user={loggedUser}
        handleLike={mockHandler}
      />
    )

    const user = userEvent.setup()

    // Ensin klikataan view-nappia, jotta like-nappi tulee näkyviin
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Haetaan näkyvissä oleva like-nappi
    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton) // klikataan nappia 2 kertaa
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2) // tarkistetaan että mockkia klikattiin 2 kertaa
  })
})

// Testauskattavuus: npm test -- --coverage