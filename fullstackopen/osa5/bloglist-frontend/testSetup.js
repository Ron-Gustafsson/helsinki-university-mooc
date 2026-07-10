// Testi setuppi käytössä:
// Vitest sekä Web-selainta simuloiva jsdom-kirjasto -> npm install --save-dev vitest jsdom
// Vitestin lisäksi apukirjasto React Testing Library ja laajennus jest-dom:
// npm install --save-dev @testing-library/react @testing-library/jest-dom

// jokaisen testin jälkeen suoritetaan toimenpide joka nollaa selainta simuloivan jsdomin.
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

// apukirjasto user-event pystyy painelee nappeja
// npm install --save-dev @testing-library/user-event