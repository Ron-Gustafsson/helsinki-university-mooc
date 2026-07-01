// Ympäristömuuttujien käsittely tänne
require('dotenv').config()

const dns = require('node:dns')
dns.setServers(['1.1.1.1', '8.8.8.8']) // ohitetaan paikallinen DNS-palvelin MongoDB-yhteyttä varten

const PORT = process.env.PORT
// Tuotantokäyttö
// const MONGODB_URI = process.env.MONGODB_URI

// Testikäyttö -> lisääminen tärkeää! Ettei käytetä kehitystietokantaa
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = { 
  MONGODB_URI, 
  PORT 
}