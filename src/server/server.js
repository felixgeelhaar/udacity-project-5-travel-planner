const express = require('express')
const {json} = require('body-parser')
const cors = require('cors')
const uuid = require('uuid/v4')

const {
  fetchProposals,
  fetchCityData,
  fetchCityImage,
  fetchWeatherForecast,
} = require('./thirdParty')

// Variable to keep the trips persistant – should be replaced by db
let tripData = [
  {
    id: uuid(),
    city: 'Paris, France',
    img: 'https://via.placeholder.com/320',
    date: '20.01.2020',
    difference: '220',
    weather: {
      min: '-2.5',
      max: '5',
      summary: 'Nice, warm and slighlt windy',
    },
  },
]

// Get port from environment otherwise fallback to port 3000
const PORT = process.env.PORT || 3000

// initialize express server with json and cors middleware
const app = express()

app.use(json())
app.use(cors())

// Serve static files from dist folder
app.use(express.static('dist'))

app.get('/trips', (req, res) => {
  res.status(200).send(tripData)
})

app.get('/proposal', async (req, res) => {
  try {
    const {city} = req.query
    const result = await fetchProposals(city)
    res.status(200).send(result)
  } catch (e) {
    res.status(404).send(e)
  }
})
app.get('/city', async (req, res) => {
  try {
    const {term} = req.query
    const match = term.replace(/\s/g, '').split(',')
    const result = await fetchCityData(match)
    res.status(200).send(result)
  } catch (e) {
    res.status(404).send(e)
  }
})
app.get('/weather', async (req, res) => {
  try {
    const {lat, lng, time} = req.query
    const {
      daily: {data},
    } = await fetchWeatherForecast(lat, lng, time)
    const {summary, temperatureMax, temperatureMin} = data[0]
    res.status(200).send({
      summary: summary,
      max: temperatureMax,
      min: temperatureMin,
    })
  } catch (e) {
    res.status(404).send(e)
  }
})
app.get('/image', async (req, res) => {
  try {
    const {cityName} = req.query
    const {webformatURL} = await fetchCityImage(cityName)
    res.status(200).send({url: webformatURL})
  } catch (e) {
    res.status(404).send(e)
  }
})
app.post('/saveTrip', (req, res) => {
  const {img, city, date, difference, weather} = req.params
  tripData.push({id: uuid(), img, city, date, difference, weather})
  res.status(201).send()
})

app.delete('/trip', (req, res) => {
  const {id} = req.query
  const tripIndex = tripData.findIndex(trip => trip.id === id)
  if (tripIndex === -1) {
    res.status(404).send()
  }
  tripData.splice(tripIndex, 1)
  res.status(201).send()
})

// Run server on provided port
app.listen(PORT, () =>
  console.log(`Server is up & running and listens on port ${PORT}`),
)
