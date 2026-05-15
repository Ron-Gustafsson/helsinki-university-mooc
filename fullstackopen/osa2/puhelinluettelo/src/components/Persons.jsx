const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <ul>
      {personsToShow.map(person =>
        // näytetään henkilön nimi, numero (datan id) ja poistopainike
        <li key={person.id}>
          {person.name} {person.number}
          {/* step 9 nappi henkilön poistoon */}
          <button onClick={() => deletePerson(person.id)}>
            delete
          </button>
        </li>
      )}
    </ul>
  )
}

export default Persons