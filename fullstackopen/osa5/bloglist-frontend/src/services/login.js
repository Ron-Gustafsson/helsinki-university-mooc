import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  // Lähetetään username ja password backendille
  const response = await axios.post(baseUrl, credentials)

  // Backend palauttaa käyttäjän tokenilla
  return response.data
}

export default { login }