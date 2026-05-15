import Weather from "./Weather"

// komponentti yhden maan tarkemiin tietoihin
const CountryDetails = ({ country }) => {

    // muutetaan kielten arvot taulukoksi
    const languages = Object.values(country.languages)

    return (
        <div>
            {/* maan nimi */}
            <h2>{country.name.common}</h2>

            {/* pääkaupunki ja datasta ensimmäinen arvo */}
            <p>Capital: {country.capital[0]}</p>

            {/* maan pinta-ala */}
            <p>Area: {country.area}</p>

            <h2>Languages</h2>

            {/* käydään kielet läpi ja näytetään listassa */}
            <ul>
                {languages.map(language => (
                <li key={language}>{language}</li>
                ))}
            </ul>

            {/* näytetään maan lippu */}
            <img
                src={country.flags.png}
                alt={`flag of ${country.name.common}`}
                width="200"
            />

            {/* näytetään pääkaupungin sää */}
            <Weather
                capital={country.capital[0]}
                capitalInfo={country.capitalInfo}
            />
        </div>
    )
}
export default CountryDetails