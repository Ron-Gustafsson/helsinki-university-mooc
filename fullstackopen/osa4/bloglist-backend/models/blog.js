// Blogilistan skeeman määrittely
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { // 4.12 title ja url muutetaan pakolliseksi
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0 
  },

  // 4.15: blogeihin tieto sen luoneesta käyttäjästä
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // muuttaa mongodb _id kentän id-kentäksi
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id // poistaa alkuperäisen _id api vastauksesta
    delete returnedObject.__v // poistaa mongodb versionumeron vastauksesta
  }
})

module.exports = mongoose.model('Blog', blogSchema)