const express = require('express') // ottaa Express käyttöön
const morgan = require('morgan') // ottaa morgan middlewaren käyttöön
const app = express() 
const cors = require('cors') // tehtävä 3.9 step 9 otetaan cors käyttöön

app.use(cors()) // sallii pyynnöt eri portista

// step 5: JSON-parseri mahdollistaa reguest.body lukemisen POST pyynnöissä
app.use(express.json())

// step 7: Morgan middleware käyttöön
//app.use(morgan('tiny'))

//step 8: luodaan Morganille oma token joka näyttää bodyn
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: "1"
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: "2"
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: "3"
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: "4"
    }
]

// step 1 palauttaa persons taulukon henkilöt json-muodossa, express muuntaa automaattisesti
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// step 2 palautetaan persons henkilömäärä ja pyynnön tekohetki
app.get('/info', (request, response) => {
    const henkiloMaara = persons.length
    const pyyntoAika = new Date()

    response.send(`
      <p>Phonebook has info for ${henkiloMaara} people</p>
      <p>${pyyntoAika}</p>
      `)
})

// step 3 yksittäisen puhelinnumerotiedon näyttäminen
app.get(`/api/persons/:id`, (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person) // palauttaa henkilön
  } else {
    response.status(404).end() // jos ei löyd not found
  }
})

//step 4 yksittäisen tiedon poisto
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  // luo uuden taulukon ilman poistettavaa henkilöä
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

//step 5 uuden puhelintiedon lisäys
app.post('/api/persons', (request, response) => {
  const body = request.body

  // step 6 virheenkäsittely nimi ja numero
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  // jos nimi esiintyy jo
  const nameExists = persons.some(person => person.name === body.name)

    if (nameExists) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

  const id = Math.floor(Math.random() * 1000000 + 1).toString() // uusi id

  // tehdään uusi henkilö
  const newPerson = {
    name: body.name,
    number: body.number,
    id: id,
  }

  // lisää uuden henkilön persons taulukkoon
  persons = persons.concat(newPerson)
  // palauttaa uuden henkilön
  response.status(201).json(newPerson)
})

const PORT = process.env.PORT || 3001 // step 10: käyttöön ympäristömuuttujan portti (.env) tai 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// step 1 3-4 tuntia
// step 2 1 tunti
// step 3 30 min
// step 4 1 tunti
// step 5 1 tunti
// step 6 1 tunti
// step 7 30 min
// step 8 1 tunti
// 3.9 step 9 30 min
// step 10 