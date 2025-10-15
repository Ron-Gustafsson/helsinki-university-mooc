import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  // tallennetaan mikä anekdootti käytössä eli alussa ensimmäinen
  const [selected, setSelected] = useState(0)

  // käytetään reactin hookia, taulukko täynnä nollia ja yksi jokaiselle anekdootille
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  // funktio valitsee satunnaisen anekdootin, kun nappia painetaan.
  const nextAnecdote = () => {
    const randomAnecdote = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomAnecdote)
  }

  // funktio äänestämiseen, joka luo kopion äänitaulukosta, kasvattaa sitä ja päivittää uudella taulukolla
  const voteAnecdote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  // Eniten ääniä saanut anekdootti ja indeksi millä on eniten ääniä
  const MostVotedAnecdote = Math.max(...votes)
  const MostVotedIndex = votes.indexOf(MostVotedAnecdote)

  return (
    <div>
      <h1>Anecdote of the day</h1>

      {/* Näytetään näkyvillä oleva anekdootti */}
      <div>{anecdotes[selected]}</div>

      {/* Näytetään sen saamien äänien määrä */}
      <div>has {votes[selected]} votes</div>

      {/* Äänestysnappi */}
      <button onClick={voteAnecdote}>vote</button>

      {/* Nappi satunnaisen anekdootin näyttämiseen */}
      <button onClick={nextAnecdote}>next anecdote</button>

      <h1>Anecdote with most votes</h1>

      {/* Näyttää eniten äänia saaneen anekdootin */}
      <div>{anecdotes[MostVotedIndex]}</div>
      <div>has {MostVotedAnecdote} votes</div>
    </div>
  )
}

export default App