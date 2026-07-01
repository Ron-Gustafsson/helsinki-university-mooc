import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      // Sisennys kahdella välilyönnillä
      '@stylistic/js/indent': ['error', 2],

      // Rivinvaihdot Unix-tyyliin, eli LF eikä Windowsin CRLF
      '@stylistic/js/linebreak-style': ['error', 'unix'],

      // Merkkijonot yksinkertaisilla lainausmerkeillä
      '@stylistic/js/quotes': ['error', 'single'],

      // Ei puolipisteitä rivien loppuun
      '@stylistic/js/semi': ['error', 'never'],

      // Vaaditaan tarkka vertailu: === ja !==
      eqeqeq: 'error',

      // Ei ylimääräisiä välilyöntejä rivien lopussa
      //'no-trailing-spaces': 'error',

      // Objektien aaltosulkeiden sisään välilyönnit: { name, number }
      'object-curly-spacing': ['error', 'always'],

      // Nuolifunktioiden nuolen ympärille välilyönnit: () => {}
      'arrow-spacing': ['error', { before: true, after: true }],

      // Sallitaan console.log backendissä
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
]