// Komponentti Course vastaa kurssin tietojen näyttämisestä
// Se saa propsina "course"-olion, joka sisältää kurssin nimen ja sen osat (parts)
const Course = ({ course }) => {
// Lasketaan tehtävien määrä metodilla reduce
  const total = course.parts.reduce((sum, part) => {
    console.log('What is happening', sum, part)
    return sum + part.exercises
  }, 0)

    return (
        <div>
            {/* näyttää kurssin nimen Header-komponentilla */}
            <Header name={course.name} />

            {/* näyttää kurssin osat */}
            <Content parts={course.parts} />

            {/* näyttää tehtävien määrän */}
            <p><strong>total of {total} exercises</strong></p>
        </div>
    )
}

// näyttää kurssin nimen otttsikkona
const Header = ({ name }) => <h2>{name}</h2>

// Content hoitaa kurssin osien listauksen -> propsina "parts". parts-taulukko map-funktiolla läpi, jokaisesta part-oliosta tehdään oma Part-komponentti.
const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part => (
                <Part key={part.id} name={part.name} exercises={part.exercises} />
            ))}
        </div>
    )
}

// Part-komponentti näyttää yksittäisen kurssinb nimen osan ja harjoitusten määrän
const Part = ({ name, exercises}) => {
    return (
        <p>
            {name} {exercises}
        </p>
    )
}

export default Course