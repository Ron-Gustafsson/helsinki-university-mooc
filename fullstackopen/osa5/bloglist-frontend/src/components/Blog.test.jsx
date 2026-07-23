import { render, screen } from '@testing-library/react'
//import userEvent from '@testing-library/user-event' // mahdollistaa nappien painelun
import Blog from './Blog'
import { describe, expect, test } from 'vitest' // Testi menee läpi ilman näitäkin, mutta problems valittaa virheistä

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

// // Blog-komponentti tarvitsee myös kirjautuneen käyttäjän tiedon -> annetaan eri käyttjä
// const loggedUser = {
//   username: 'otheruser',
//   name: 'Other User'
// }

// Käyttäjä ei ole luonut blogia
const otherUser = {
  username: 'otheruser',
  name: 'Other User'
}

// Käyttäjä on luonut blogin -> sama kuin blogin luoja
const blogCreator = {
  username: 'testuser',
  name: 'Test User'
}

describe('<Blog />', () => {
  // // 5.13: Testaa, että Blog-komponentti renderöi blogin titlen
  // test('renders title', () => {
  //   render(<Blog blog={blog} user={loggedUser} />) //  renderöi komponentin React Testing Library ‑kirjaston tarjoaman funktion render avulla

  //   //screen.debug() //tulostaa komponentin tuottaman html:n

  //   // Haetaan blogin title renderöidystä komponentista
  //   const element = screen.getByText(blog.title, { exact: false }) //// exact: false sallii sen, että samassa elementissä on myös muuta tekstiä div sisällä

  //   //screen.debug(element)

  //   // Tarkistetaan, että title löytyi
  //   expect(element).toBeDefined()
  // })

  // // 5.14: Testaa, että lisätiedot näkyvät view-napin painamisen jälkeen
  // test('shows url, likes and user when view button is clicked', async () => {
  //   render(<Blog blog={blog} user={loggedUser} />) //  renderöi komponentin React Testing Library ‑kirjaston tarjoaman funktion render avulla

  //   const user = userEvent.setup() // aloittaa uuden session ja simuloi käyttäjän toimintaa selaimessa

  //   // Hakee komponentista napin tekstin perusteella ja klikkaa sitä
  //   const button = screen.getByText('view')
  //   await user.click(button)

  //   // Tarkistetaan että lisätiedot näkyvät ruudulla eli näkymättömäksi tekevää tyyliä ei enää ole
  //   expect(screen.getByText(blog.url)).toBeVisible()
  //   expect(screen.getByText(`likes ${blog.likes}`, { exact: false })).toBeVisible() // saa olla myös like nappi
  //   expect(screen.getByText(blog.user.name)).toBeVisible()
  // })

  // // 5.15: testi, joka varmistaa, että jos komponentin like-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa
  // test('clicking the button 2 times calls event handler two times', async () => {
  //   // Mock-funktio, jonka kutsujen määrän voi tarkistaa
  //   const mockHandler = vi.fn()

  //   render(
  //     <Blog
  //       blog={blog}
  //       user={loggedUser}
  //       handleLike={mockHandler}
  //     />
  //   )

  //   const user = userEvent.setup()

  //   // Ensin klikataan view-nappia, jotta like-nappi tulee näkyviin
  //   const viewButton = screen.getByText('view')
  //   await user.click(viewButton)

  //   // Haetaan näkyvissä oleva like-nappi
  //   const likeButton = screen.getByRole('button', { name: 'like' })
  //   await user.click(likeButton) // klikataan nappia 2 kertaa
  //   await user.click(likeButton)

  //   expect(mockHandler.mock.calls).toHaveLength(2) // tarkistetaan että mockkia klikattiin 2 kertaa
  // })

  // 5.27 testit muuttuu
  // Kirjautumattomalle käyttäjälle näytetään blogin tiedot, mutta like- ja remove-nappeja ei näytetä
  test('shows blog information but no buttons for logged out user', () => {
    render(<Blog blog={blog} />) //  renderöi komponentin React Testing Library ‑kirjaston tarjoaman funktion render avulla

    //screen.debug() //tulostaa komponentin tuottaman html:n

    // Tarkistetaan, että blogin otsikko näkyy.
    // exact: false sallii sen, että samassa elementissä näkyy myös kirjoittaja.
    expect(screen.getByText(blog.title, { exact: false })).toBeVisible()

    // Tarkistetaan, että blogin URL-osoite näkyy.
    expect(screen.getByText(blog.url)).toBeVisible()

    // Tarkistetaan, että tykkäysten määrä näkyy.
    expect(screen.getByText(`likes ${blog.likes}`, { exact: false })).toBeVisible()

    // Tarkistetaan, että blogin lisänneen käyttäjän nimi näkyy.
    expect(screen.getByText(blog.user.name, { exact: false })).toBeVisible()

    // queryByRole palauttaa null-arvon, jos nappia ei löydy. Tarkistetaan ettei elementtiä ole olemassa
    const likeButton = screen.queryByRole('button', { name: 'like' })

    // Kirjautumattomalle käyttäjälle ei näytetä like-nappia.
    expect(likeButton).not.toBeInTheDocument()

    // Etsitään remove-nappia samalla tavalla.
    const removeButton = screen.queryByRole('button', { name: 'remove' })

    // Kirjautumattomalle käyttäjälle ei näytetä remove-nappia.
    expect(removeButton).not.toBeInTheDocument()
  })

  // 5.27: kirjautuneelle käyttäjälle, joka ei ole blogin luoja näytetään ainoastaan tykkäysnappi
  test('shows only like button for user who is not blog creator', () => {
    // Renderöidään blogi kirjautuneelle käyttäjälle -> otheruser ei ole blogin luonut käyttäjä
    render(
      <Blog
        blog={blog}
        user={otherUser}
      />
    )

    // Haetaan like nappi, jonka täytyy löytyä
    const likeButton = screen.getByRole('button', { name: 'like' })

    expect(likeButton).toBeVisible()

    // remove nappia ei pidä löytyä ja siihen sopii queryByRole
    const removeButton = screen.queryByRole('button', { name: 'remove' })

    //otherUser ei ole blogin luoja, joten nappia ei näytetä
    expect(removeButton).not.toBeInTheDocument()
  })

  // 5.27: Blogin luojalle näytetään myös poistonappi
  test('shows like and remove buttons for blog creator', () => {
    render(
      <Blog
        blog={blog}
        user={blogCreator}
      />
    )

    // blogin luojalle näytetään like-nappi
    const likeButton = screen.getByRole('button', { name: 'like' })
    expect(likeButton).toBeVisible()

    // Blogin luojalle näytetään lisäksi remove-nappi
    const removeButton = screen.getByRole('button', { name: 'remove' })
    expect(removeButton).toBeVisible()
  })
})

// Testauskattavuus: npm test -- --coverage

// tämä tiedosto: test.only: npm test -- --test-only components/Blog.test.jsx
// npm test -- --test-only suorittaa only testit
// npm test -- components/Blog.test.jsx suorittaa tiedoston testit