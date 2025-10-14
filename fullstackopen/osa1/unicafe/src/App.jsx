import { useState } from 'react'

// määritellaan painikkeet
const Button = ({ onClick, text }) => (
  <button onClick= {onClick}>
    {text}
  </button>
)

// uusi komponentti, huolehtii tilastorivien näyttämisestä
const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

// statistics näyttämiseen oma komponentti
const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if(all === 0) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text='good' value={good} />
        <StatisticsLine text='neutral' value={neutral} />
        <StatisticsLine text='bad' value={bad} />
        <StatisticsLine text='all' value={all} />
        <StatisticsLine text='average' value={average.toFixed(1)} />
        <StatisticsLine text='positive' value={`${positive.toFixed(1)} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  //tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] =useState(0)

  // painallusten käsittely
  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  // lasketaan yhteismäärä renderöinnissä
  const all = good + neutral + bad

  // lasketaan keskiarvo (hyvän arvo 1, neutraalin 0, huonon -1) eli neutraalista ei tartte välittää
  const average = all === 0 ? 0 : (good - bad) / all

  // lasketaan hyvien palautteiden prosenttiosuuden kaikista palautteista
  const positive = all === 0 ? 0 : (good / all) * 100

  return (
    <div>
      <h1>give feedback</h1>
      
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />

      <h1>statistics</h1>

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  )
}

export default App