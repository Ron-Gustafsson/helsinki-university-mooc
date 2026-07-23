// Helper poistaa toistuvan kirjautumisen ja blogin luomisen testeihin

const loginWith = async (page, username, password) => {
  // Täytetään kirjautumistiedot
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)

  // Kirjaudutaan sisään
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  // Avataan uuden blogin lomake
  //await page.getByRole('button', { name: 'create new blog' }).click()
  await page.goto('/create')

  // Haetaan blogilomakkeen kolme tekstikenttää
  const textboxes = await page.getByRole('textbox').all()

  await textboxes[0].fill(title)
  await textboxes[1].fill(author)
  await textboxes[2].fill(url)

  // Tallennetaan blogi
  await page.getByRole('button', { name: 'create' }).click()
  
  }

module.exports = { loginWith, createBlog }