import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    //haetaan kaikki henkilöt palvelimelta
    const request = axios.get(baseUrl)

    // palautetaan ainoastaan vastauksen data
    return request.then(response => response.data) 
}

const create = newPerson => {
  // lähetetään uuden henkilön palvelimelle
  const request = axios.post(baseUrl, newPerson)

  // palautetaan palvelimen tallentama henkilö, jossa on myös id
  return request.then(response => response.data)
}

// step 9 poista henkilö
const remove = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

// step 10 päivittää henkilön
const update = (id, updatePerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatePerson)
  return request.then(response => response.data)
}

export default {
  getAll,
  create,
  remove,
  update
}