const App = () => {
  // muutos: yksi JavaScript olio
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  // näytttää kurssin nimen
  const Header = ({ course }) => <h1>{course}</h1>
  console.log(course)

  // näyttää yhden osan
  const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

  // Content: kokoaa kolme Part-komponenttia
  const Content = ({ parts }) => (
      <div>
        <Part part={parts[0]} />
        <Part part={parts[1]} />
        <Part part={parts[2]} />
      </div>
    )
  
  // laskee exercises-arvot yhteen
  const Total = ({ parts }) => (
    <p>
      Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises }
    </p>
  )

  // välittää olio-propsit
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App