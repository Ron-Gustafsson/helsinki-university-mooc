import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetails from './components/CountryDetails'


const App = () => {
  const [countries, setCountries] = useState([]) // tallennetaan APIsta haetut maat
  const [search, setSearch] = useState('') // tallennetaan hakukentän teksti
  const [selectedCountry, setSelectedCountry] = useState(null) // 2.19 tallentaa show napilla valitun maan

  useEffect(() => {
    // haetaan kaikki maat heti alussa
    axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
        //console.log('Countries loaded:', response.data.length)
        setCountries(response.data)
        })
    }, []) // tyhjä taulukko tarkoittaa suorita vain kerran alussa

    const handleSearchChange = (event) => {
        // uudessa haussa poistetaan aiemmin show napilla valittu maa
        setSelectedCountry(null)

        // päivitetään hakukentän arvo
        setSearch(event.target.value)
    }

    // tarkistaa onko hakukentässä tekstiä, trim poistaa välilyönnit
    const hasSearch = search.trim() !== ''

    // suodattaa maat vain kun on tekstiä > jos tyhjä ei too many matches viestiä
    const countriesToShow = hasSearch
        ? countries.filter(country =>
            country.name.common.toLowerCase().includes(search.toLowerCase())
            )
        : []
    //console.log('Countries to show:', countriesToShow.length)

    const handleShowCountry = (country) => {
        // klikattu maa omaan stateen
        setSelectedCountry(country)
        setSearch('')
        console.log('Selected country:', country.name.common)
        }

    return (
    <div>
        <h1>Country Information</h1>

        <label>
        Find countries:{' '}
        <input
            type="text"
            value={search}
            onChange={handleSearchChange}
        />
        </label>

        {/* jos show napilla valittu maa, näytetään sen tiedot */}
        {selectedCountry && (
            <CountryDetails country={selectedCountry} />
        )}

        {/* Jos maata ei ole valittu ja osumia on yli 10, näytetään ohje tarkentaa hakua */}
        {!selectedCountry && countriesToShow.length > 10 && (
            <p>Too many matches, please make your entry specific</p>
        )}

        {/* Jos maata ei ole valittu ja osumia on 2–10, näytetään maiden nimet listana ja show napit */}
        {!selectedCountry && countriesToShow.length <= 10 && countriesToShow.length > 1 && (
            <div>
            {countriesToShow.map(country => (
                // cca3 on datan 3-kirjaiminen maakoodi, jota käytetään yksilöllisenä key-arvona
                <p key={country.cca3}>
                {country.name.common}{' '}
                <button onClick={() => handleShowCountry(country)}>
                    Show Data
                </button>
                </p>
            ))}
            </div>
        )}

        {/* jos maata ei ole valittu ja osumia on tasan yksi, näytetään maan tarkemmat tiedot */}
        {!selectedCountry && countriesToShow.length === 1 && (
            <CountryDetails country={countriesToShow[0]} />
        )}
    </div>
    )
}

export default App