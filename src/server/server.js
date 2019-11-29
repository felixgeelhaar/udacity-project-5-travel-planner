const express = require('express')
const {json, urlencoded} = require('body-parser')
const cors = require('cors')
const uuid = require('uuid/v4')

const {fetchCityProposals, fetchCityData} = require('./geonames')
const {fetchCityImage} = require('./pixabay')
const {fetchCityForeCast} = require('./darksky')

// Variable to keep the trips persistant – should be replaced by db
let tripData = []

// Get port from environment otherwise fallback to port 3000
const PORT = process.env.PORT || 3000

// initialize express server with json and cors middleware
const app = express()

app.use(urlencoded({extended: false}))
app.use(json())
app.use(cors())

// Serve static files from dist folder
app.use(express.static('dist'))

// Get all trips
app.get('/trips', (req, res) => {
  res.status(200).send(tripData)
})

// Get city proposals
app.get('/proposals', async (req, res) => {
  try {
    const data = await fetchCityProposals(req.query.term)
    const proposals = await data.geonames.map(({name, countryCode}) => ({
      location: `${name}, ${countryCode}`,
    }))
    res.status(200).send(proposals)
  } catch (e) {
    res.sendStatus(404)
  }
})

// Save a trip based on location and date
app.post('/trip', async (req, res) => {
  try {
    const {location: city, date} = req.body
    const [cityName, country] = city.replace(/\s/g, '').split(',')
    const [{lat, lng, location}, img] = await Promise.all([
      fetchCityData(cityName, country),
      fetchCityImage(`${cityName}`),
    ])
    const weather = await fetchCityForeCast(lat, lng, date)
    // Calc time difference in days with no comma
    const difference = (
      (new Date(date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
    ).toFixed(0)
    const trip = {
      id: uuid(),
      img,
      location,
      date,
      difference,
      weather,
    }
    tripData.push(trip)
    res.status(201).send()
  } catch (e) {
    console.log(e)
    res.res.sendStatus(404)
  }
})

// Delete a trip by id
app.delete('/trip', (req, res) => {
  const {id} = req.query
  const tripIndex = tripData.findIndex(trip => trip.id === id)
  switch (tripIndex) {
    case -1:
      res.sendStatus(404)
      break
    default:
      tripData.splice(tripIndex, 1)
      res.status(204).send({})
  }
})

// Run server on provided port
app.listen(PORT, () =>
  console.log(`Server is up & running and listens on port ${PORT}`),
)
