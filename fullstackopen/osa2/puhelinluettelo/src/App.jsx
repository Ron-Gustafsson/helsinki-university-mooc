import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) // persons tyhjä taulukko -> data palvelimelta
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('') // tallentaa uuden numeron
  const [searchName, setSearchName] = useState('') // tallentaa hakukentan tekstin
  const [notificationMessage, setNotificationMessage] = useState(null) // step 11 ilmoitukset
  const [notificationType, setNotificationType] = useState('success') // step 12 tyypeille omat, error

  useEffect(() => {
    //  step 8 haetaan henkilöt palvelinmoduulin kautta
    personService
      .getAll()
      .then(initialPersons => {
        // tallennetaan palvelimelta saadut henkilöt Reactin tilaan
        setPersons(initialPersons)
        console.log('Persons in database:', initialPersons.length)
      })
  }, [])

  // Näyttää onnistumisilmoituksen
  const showSuccessMessage = (message) => {
    setNotificationMessage(message)
    setNotificationType('success')

    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  // Näyttää virheilmoituksen
  const showErrorMessage = (message) => {
    setNotificationMessage(message)
    setNotificationType('error')

    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault() // estää sivun uudelleenLatauksen
    
    // tarkistetaan löytyykö sama nimi persons taulukosta
    const truePerson = persons.find(person => person.name === newName)

    if (truePerson) {
      // step 10 kysytään korvataanko vanha numero uudella
      const confirmUpdate = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
      )

        if (!confirmUpdate) {
          // jos perutaan niin lopetaan
          return
        }
        
        // luodaan päivitetty henkilö, vanhat tiedot säilyy, numero vaihtuu
        const updatedPerson = {
          ...truePerson,
          number: newNumber
        }

        // päivittää henkilön palvelimelle
        personService
          .update(truePerson.id, updatedPerson)
          .then(returnedPerson => {
            console.log('updating person:', truePerson)
            console.log('update success:', returnedPerson)

            // korvataan vanha henkilö palvelimen palauttamalla versiolla
            setPersons(persons.map(person =>
              person.id !== truePerson.id ? person : returnedPerson
            ))

            showSuccessMessage(`Updated ${returnedPerson.name}`) // ilmoitus päivityksestä
            
            // tyhjentää input kentän päivityksen jälkeen
            setNewName('')
            setNewNumber('')
          })

          .catch (() => {
            // step 12 näytetään virheilmoitus, jos henkilöä ei enää löydy palvelimelta
            showErrorMessage(
              `Information of ${truePerson.name} has already been removed from server`
            )

            // poistetaan poistettu henkilö myös Reactin tilasta
            setPersons(persons.filter(person => person.id !== truePerson.id))

            // input tyhjäksi
            setNewName('')
            setNewNumber('')
          })

        return
        }
    
    // luo uuden henkilön input-kentän syötteestä
    const newPerson = {
      name: newName,
      number: newNumber
    }

    // käytetään uutta moduulia step 8
    personService
      .create(newPerson)
      .then(returnedPerson => {
        console.log(returnedPerson) // tarkistetaan mitä palvelin palauttaa
        console.log('success')
        setPersons(persons.concat(returnedPerson)) 
        showSuccessMessage(`Added ${returnedPerson.name}`) // ilmoitus lisäämisestä
        setNewName('') // tyhjentää inputin
        setNewNumber('')
      })
    }

  // step 9 poista henkilö
  const deletePerson = id => {
    const person = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showSuccessMessage(`Deleted ${person.name}`) // ilmoitus poistosta
        })
    }
  }

  // nimen käsittelijä
  const handleNameChange = (event) => {
    // päivittää input-kentän arvon Reactin tilaan
    setNewName(event.target.value)
  }
  
  // numeron käsittelijä
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  // hakukentän käsittelijä
  const handleSearchChange = (event) => {
    setSearchName(event.target.value)
  }

  // rajataan näytettävät henkilöt
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification 
      message={notificationMessage}
      type={notificationType}
      />

      <Filter
        searchName={searchName}
        handleSearchChange={handleSearchChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons 
      personsToShow={personsToShow}
      deletePerson={deletePerson}
      />
    </div>
  )
}

export default App