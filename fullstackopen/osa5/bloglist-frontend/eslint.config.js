import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      // Sisennys pitää olla 2 välilyöntiä
      indent: ['error', 2],

      // Rivinvaihtojen pitää olla Unix-tyylisiä eli LF, ei Windowsin CRLF
      'linebreak-style': ['error', 'unix'],

      // Merkkijonoissa käytetään yksittäisiä lainausmerkkejä: 'teksti'
      quotes: ['error', 'single'],

      // Puolipisteitä ei käytetä rivien lopussa
      semi: ['error', 'never'],

      // Pakottaa käyttämään tarkkaa vertailua: === ja !==
      eqeqeq: 'error',

      // Rivien lopussa ei saa olla ylimääräisiä välilyöntejä
      'no-trailing-spaces': 'error',

      // Olion aaltosulkujen sisällä pitää olla välit: { name: 'Ron' }
      'object-curly-spacing': ['error', 'always'],

      // Nuolifunktiossa nuolen ympärillä pitää olla välit: name => name.id
      'arrow-spacing': ['error', { before: true, after: true }],

      // Sallii console.log / console.error -komennot
      'no-console': 'off'
    }
  }
]
