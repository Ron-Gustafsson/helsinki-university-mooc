const dns = require('node:dns')
dns.setServers(['1.1.1.1', '8.8.8.8']) // koneeni käyttää paikallista dns serveriä [ '127.0.0.1' ], joten tämä ohittää sen
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://ron_gustafsson:${password}@cluster0.buryfrk.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// yhdistetään ensin tietokantaan (jos tämä korjaisi yhteysongelman)
mongoose.connect(url, { family: 4 })
  .then(() => {
    if (process.argv.length === 3) {
      // Jos annetaan vain salasana, listataan henkilöt
      Person.find({}).then(persons => {
        console.log('phonebook:')

        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })

        mongoose.connection.close()
      })
    } else if (process.argv.length === 5) {
      // Jos annetaan salasana, nimi ja numero, lisätään henkilö
      const person = new Person({
        name: name,
        number: number,
      })

      person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
    } else {
      console.log('usage:')
      console.log('node mongo.js password')
      console.log('node mongo.js password name number')
      mongoose.connection.close()
    }
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })