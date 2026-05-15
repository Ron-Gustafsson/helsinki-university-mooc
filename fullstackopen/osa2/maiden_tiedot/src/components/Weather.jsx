import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital, capitalInfo }) => {
    // tänne tallennetaan api avaimella haettu säädata
    const [weather, setWeather] = useState(null)

    // tallennetaan mahdollinen virhe viesti
    const [error, setError] = useState(null)

    // API-avaimen lukeminen
    const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY

    useEffect(() => {
        // jos kaupungin koordinaatteja ei ole, säädataa ei haeta
        if (!capitalInfo?.latlng || !api_key) {
            return
        }

        // Countries data muodossa Lat, Lon
        const [lat, lon] = capitalInfo.latlng

        // haetaan pääkaupungin sää koordinaattien perusteella
        axios
        .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
        )
        .then(response => {
            console.log('Weather loaded for:', capital)
            setWeather(response.data)

            //tyhjennetään mahdollinen aiumpi virhe
            setError(null)
        })
        .catch(error => {
            console.error('Weather fetch failed:', error.message)
            setError('Weather data could not be loaded')
        })
    }, [capital, capitalInfo, api_key])

    // jos API puuttuu
    if (!api_key) {
        return <p>Weather API key is missing</p>
    }

    // jos error tapahtui -> virheviesti
    if (error) {
        return <p>{error}</p>
    }

    // näytetään latausviesti
    if (!weather) {
        return <p>Loading weather...</p>
    }

    // OpenWeatherMap palauttaa sääkuvakkeen tunnisteen weather-taulukossa
    const icon = weather.weather[0].icon
    const description = weather.weather[0].description

    return (
        <div>
            <h2>Weather in {capital}</h2>
            <p>Temperature: {weather.main.temp} °C</p>

            <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
            />

            <p>Wind: {weather.wind.speed} m/s</p>
        </div>
    )
}

export default Weather