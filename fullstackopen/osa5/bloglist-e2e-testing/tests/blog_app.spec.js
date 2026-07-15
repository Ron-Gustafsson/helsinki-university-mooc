// Playwright testit tänne -> alustus luodaan uusi kansio projektille: npm init playwright@latest
// https://fullstackopen.com/osa5/end_to_end_testaus#testien-alustaminen

const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper') // helper käyttöön

// Tehtävä 5.17 testi, joka varmistaa, että sovellus näyttää oletusarvoisesti kirjautumislomakkeen.
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Tyhjennetään testitietokanta ennen jokaista testiä -> testingRouter luotu backendiin ja otettu käyttöön app.js
    const resetResponse = await request.post('/api/testing/reset')

    // Varmistetaan, että tietokannan tyhjennys onnistui
    expect(resetResponse.status()).toBe(204)

    // Luodaan tietokantaan käyttäjä testejä varten
    await request.post('/api/users', {
      data: {
        name: 'Ron Gustafsson',
        username: 'Ron',
        password: 'salasana'
      }
    })

    // Avataan blogisovellus
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    // Tarkistetaan että kirjautumislomake tulee näkyviin ja kentät
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username:')).toBeVisible()
    await expect(page.getByLabel('password:')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  // 5.18 Testit kirjatumiselle: Onnistunut ja epäonnistunut kirjautuminen
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // Kirjaudutaan sisään
      await loginWith(page, 'Ron', 'salasana')

      // Tarkistetaan että kirjautuneen käyttäjän tiedot renderöityvät ruudullee
      await expect(page.getByText('Ron Gustafsson logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // Kirjaudutaan sisään
      await loginWith(page, 'Ron', 'vaarasalasana')

      //Odotetaan virhettä ja haetaan CSS luokan perusteella
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      // Varmistetaan ettei onnistunut kirjautuminen tule esiin
      await expect(page.getByText('Ron Gustafsson logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Kirjaudutaan ennen jokaista tämän lohkon testiä
      await loginWith(page, 'Ron', 'salasana')

      // Varmistetaan, että kirjautuminen valmistui
      await expect(
        page.getByText('Ron Gustafsson logged in')
      ).toBeVisible()
    })

    //5.19 Kirjautunut käyttäjä pystyy luomaan blogin ja luotu blogi tulee näkyville blogien listalle
    test('a new blog can be created', async ({ page }) => {
      // Luodaan blogi helperin avulla 
      await createBlog(
        page,
        'a new blog created by playwright',
        'Ron Gustafsson',
        'www.testi.com'
      )

      // Etsitään luotu blogi nimenomaan blogilistalta
      const createdBlog = page.locator('.blog').filter({ hasText: 'a new blog created by playwright' })

      await expect(createdBlog).toBeVisible()
    })

    // 5.20
    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        // Luodaan ennen testiä blogi, jota voidaan likettää
        await createBlog(
          page,
          'a blog to be liked',
          'Ron Gustafsson',
          'www.testi.com'
        )
      })

      // 5.20: Blogia voidaan likettää
      test('a blog can be liked', async ({ page }) => {
        // Etitään tätä testiä varten luotu blogi
        const blogToLike = page
          .locator('.blog')
          .filter({ hasText: 'a blog to be liked' })

        // Avataan blogin lisätiedot, jotta like-nappi tulee näkyviin
        await blogToLike.getByRole('button', { name: 'view' }).click()

        // Varmistetaan että liket on nollassa
        await expect(blogToLike).toContainText('likes 0')

        // Painetaan like-blogin nappia
        await blogToLike.getByRole('button', { name: 'like' }).click()

        // Varmistetaan että like määrä kasvoi yhdellä
        await expect(blogToLike).toContainText('likes 1')
      })

      //5.21 Blogin lisännyt käyttäjä voi poistaa blogin
      test('the user who created a blog can delete it', async ({ page }) => {
        // Käytetään edellisen testin blogia
        const blogToRemove = page
          .locator('.blog')
          .filter({ hasText: 'a blog to be liked' })

        // Avataan blogin lisätiedot, jotta remove-nappi tulee näkyviin
        await blogToRemove.getByRole('button', { name: 'view' }).click()

        // Tarkistetaan window.confirm ikkuna ja hyväksytään se
        page.once('dialog', async (dialog) => {
          expect(dialog.message()).toContain('Remove blog')
          await dialog.accept()
        })

        // Klikataan remove-nappia
        await blogToRemove.getByRole('button', { name: 'remove' }).click()

        // Varmistetaan, että blogi poistui
        await expect(blogToRemove).toHaveCount(0)
      })

      // 5.22 Vain blogin lisännyt käyttäjä näkee poistonapin
      test('only the creator can see the remove button', async ({ page, request }) => {
        // Luodaan toinen käyttäjä (ei ole luonut blogia)
        const otherUser = await request.post('/api/users', {
          data: {
            name: 'Other User',
            username: 'Other',
            password: 'salasana'
          }
        })

        // Luonti onnistui
        expect(otherUser.status()).toBe(201)

        const blogToCheck = page
          .locator('.blog')
          .filter({ hasText: 'a blog to be liked' })

        // Avataan blogin lisätiedot
        await blogToCheck.getByRole('button', { name: 'view' }).click()

        // Blogin luoja näkee poistonapin
        await expect(blogToCheck.getByRole('button', { name: 'remove' })).toBeVisible()

        // kirjaudu ulos
        await page.getByRole('button', { name: 'logout' }).click()

        // Kirjaudu sisään
        await loginWith(page, 'Other', 'salasana')

        await expect(page.getByText('Other User logged in')).toBeVisible()

        // Avataan sama blogi jatarkistetaan ettei Other User näe nappia
        await blogToCheck.getByRole('button', { name: 'view' }).click()

        await expect(blogToCheck.getByRole('button', { name: 'remove' })).toHaveCount(0)
      }) // test
    }) // and a blog exists

    // 5.23 tulee tähän
    test('blogs are ordered by likes', async ({ page }) => {
      // Luodaan 3 uutta blogia helperin avulla
      await createBlog(
        page,
        'first blog',
        'Ron Gustafsson',
        'www.first.com'
      )

      await createBlog(
        page,
        'second blog',
        'Ron Gustafsson',
        'www.second.com'
      )

      await createBlog(
        page,
        'third blog',
        'Ron Gustafsson',
        'www.third.com'
      )

      // Luodaan locatorit blogeille
      const firstBlog = page.locator('.blog').filter({ hasText: 'first blog' })

      const secondBlog = page.locator('.blog').filter({ hasText: 'second blog' })

      const thirdBlog = page.locator('.blog').filter({ hasText: 'third blog' })

      // Ensimmäiselle blogille ei tykkäyksiä, toiselle 1
      await secondBlog.getByRole('button', { name: 'view' }).click()

      await secondBlog.getByRole('button', { name: 'like' }).click()

      await expect(secondBlog).toContainText('likes 1')

      // kolmannelle blogille annetaan 2 tykkäystä
      await thirdBlog.getByRole('button', { name: 'view' }).click()

      await thirdBlog.getByRole('button', { name: 'like' }).click()

      // Odotetaan ensimmäisen liken päivittymistä
      await expect(thirdBlog).toContainText('likes 1')

      await thirdBlog.getByRole('button', { name: 'like' }).click()

      // Odotetaan toisen liken päivittymistä
      await expect(thirdBlog).toContainText('likes 2')

      // Haetaan kaikki blogit
      const blogs = page.locator('.blog')

      // Tarkistetaan järjestys -> .nth(0) tarkoittaa mikä blogi pitää olla ensin
      await expect(blogs.nth(0)).toContainText('third blog')
      await expect(blogs.nth(1)).toContainText('second blog')
      await expect(blogs.nth(2)).toContainText('first blog')
    }) // test
  }) // When logged in
}) // Blog app

// bloglist-e2e-testing: npx playwright test
// Frontti normaalisti: npm run dev
// Backend käynnistys: npm run start:test

// testiraportti: npm run test:report
// testejä kehitettäessä graafinen UI: npm run test -- --ui

//  Nopeampi testi, pelkkä Chronium
// npm test -- --project chromium

// Testien debuggaaminen: npm test -- -g'a blog can be liked' --debug

// Muistiin sisennyksien automaattinen korjaaja:
// paina shift + alt + F
// valitse TypeScript and JavaScript Language Features

// Go to Bracket: ctrl + shift + 1/2