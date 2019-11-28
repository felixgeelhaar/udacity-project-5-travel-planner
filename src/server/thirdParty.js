require('dotenv').config()
const fetch = require('node-fetch')

// GeoApi to fetch city details
const fetchCityData = async city => {
  const {GEO_BASEURL, GEO_USERNAME} = process.env
  const [name, country] = city
  try {
    if (!name && !country) {
      throw 'Please provide a city!'
    }
    const result = await fetch(
      `${GEO_BASEURL}/searchJSON?name=${name}&country=${country}&featureClass=P&${GEO_USERNAME}`,
    )
    return await result.json()
  } catch (e) {
    throw e
  }
}

// GeoApi to fetch city proposals
const fetchProposals = async term => {
  const {GEO_BASEURL, GEO_USERNAME} = process.env
  try {
    const result = await fetch(
      `${GEO_BASEURL}/searchJSON?name=${term}&${GEO_USERNAME}`,
    )
    return await result.json()
  } catch (e) {
    throw e
  }
}

// DarSky Api
const fetchWeatherForecast = async (lat, lng, time) => {
  const {DARKSKY_BASEURL, DARKSKY_APIKEY} = process.env
  try {
    const result = await fetch(
      `${DARKSKY_BASEURL}/${DARKSKY_APIKEY}/${lat},${lng},${new Date(
        time,
      ).getTime() /
        1000}/?exclude=currently,flags,hourly,alerts,minutely&units=si`,
    )
    return await result.json()
  } catch (e) {
    throw e
  }
}

// PixaBayApi to fetch a city image
const fetchCityImage = async cityName => {
  const {PIXABAY_BASEURL, PIXABAY_KEY} = process.env
  try {
    const result = await fetch(
      `${PIXABAY_BASEURL}?q=${cityName}&image_type=photo&category=places&key=${PIXABAY_KEY}`,
    )
    const images = await result.json()
    return images.hits[0]
  } catch (e) {
    throw e
  }
}

module.exports = {
  fetchProposals,
  fetchCityData,
  fetchWeatherForecast,
  fetchCityImage,
}
