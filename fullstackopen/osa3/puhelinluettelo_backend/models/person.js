const dns = require('node:dns')
dns.setServers(['1.1.1.1', '8.8.8.8']) // ohitetaan paikallinen DNS-palvelin MongoDB-yhteyttä varten

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    minlength: [8, 'Phone number must be at least 8 characters long'],
    validate: {
      validator: function(value) {
        //^ alusta asti, 2/3 numeroa, väliviiva, \d+ yksi tai useampi numero, $ loppuun asti
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: props => `${props.value} is not a valid phone number`
    }
  },
})

// Muutetaan MongoDB:n _id frontendille sopivaksi id-kentäksi
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)