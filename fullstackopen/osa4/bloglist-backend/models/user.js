// Käyttäjien Mongoose-skeema
const mongoose = require('mongoose')

// käyttäjän rakenne tietokantaan
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },

  name: String,

  passwordHash: {
    type: String,
    required: true,
  },

  //käyttäjän lisäämät blogit
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId, // ObjectId viittaa toisen dokumenttiin
      ref: 'Blog' // ref kertoo et viitataan Blog modeliin
    }
  ],
})

// määrittää miltä käyttäjä näyttää JSON-vastauksessa
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    // Salasanan hashia ei näytetä käyttäjälle
    delete returnedObject.passwordHash
  }
})

// User malli userSchema perusteella
const User = mongoose.model('User', userSchema)

module.exports = User