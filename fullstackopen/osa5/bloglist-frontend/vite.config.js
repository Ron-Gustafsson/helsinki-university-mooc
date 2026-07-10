import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  },
  // testejä varten lisäys
  test: {
    environment: 'jsdom',
    globals: true, // true ansiosta testien käyttämiä avainsanoja kuten describe, test ja expect ei ole tarvetta importata testeissä.
    setupFiles: './testSetup.js',
  }
})
