import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom' // 5.24:React Router mahdollistaa reitityksen selaimen osoiterivillä
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  // Router mahdollistaa url-osoitteiden navigoinnin
  <Router>
    <App />
  </Router>
)