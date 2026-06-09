require('dotenv').config() // dotenv käyttöön -> mahdollistaa .env käytön ilman käynnistyskomennon muokkaamista
const express = require('express') // ottaa Express käyttöön
const morgan = require('morgan') // ottaa morgan middlewaren käyttöön
const Person = require('./models/person')
const app = express() 
//const cors = require('cors') // tehtävä 3.9 step 9 otetaan cors käyttöön

//app.use(cors()) // sallii pyynnöt eri portista

// step 5: JSON-parseri mahdollistaa reguest.body lukemisen POST pyynnöissä
app.use(express.json())

// step 11: tarkistaa frontendin tuotantoversion dist hakemistosta
app.use(express.static('dist'))

// step 7: Morgan middleware käyttöön
//app.use(morgan('tiny'))

//step 8: luodaan Morganille oma token joka näyttää bodyn
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'))

// 3.13: haetaan kaikki henkilöt MongoDB-tietokannasta
app.get('/api/persons', (request, response, next) => {
    Person.find({})
      .then(persons => {
        response.json(persons)
      })
      .catch(error => next(error))
})

// 3.18 muutoksen jälkeen hakee henkilöiden määrän mongodb-tietokannasta
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const pyyntoAika = new Date()

      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${pyyntoAika}</p>
      `)
    })
    .catch(error => next(error))
})

// 3.18: yksittäisen puhelintiedon näyttäminen tietokannasta
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// 3.15: yksittäisen puhelintiedon poisto MongoDB-tietokannasta
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// 3.14: uuden puhelintiedon lisäys MONGODB tietokantaan
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // tarkistetaan että nimi on annettu
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  // tarkistetaan että numero on annettu
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  // luodaan uusi henkilö MongoDB varten
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  // tallentaa henkilön tietokantaan
  person.save()
    .then(savedPerson => {
      // palauttaa uuden henkilön
      response.status(201).json(savedPerson)
      console.log("Henkilö tallennettu onnistuneesti")
    })
    .catch(error => next(error))
})

// 3.17: päivitetään olemassa olevan henkilön numero MongoDB-tietokantaan
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // nimen tarkastus
  if (!name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  // numeron tarkastus
  if (!number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  Person.findById(request.params.id)
    .then(person => {
      // jos henkilöä ei löydy id:llä
      if (!person) {
        return response.status(404).end()
      }

      // päivitetään henkilön tiedot
      person.name = name
      person.number = number

      // tallennetaan muutos tietokantaan
      return person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

// 3.16: tuntematton osoitteen käsittely
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

// 3.16: keskitetty virheidenkäsittely middlewareen
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    // palautetaan mongoosen validointivirhe frontille
    return response.status(400).json({
       error: error.message
    })
  }
  // muut virheet Expressille
  next(error)
}

// kutsutaan virheenkäsittelijää
app.use(errorHandler)

const PORT = process.env.PORT || 3001 // step 10: käyttöön ympäristömuuttujan portti (.env) tai 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// osa3 D: 