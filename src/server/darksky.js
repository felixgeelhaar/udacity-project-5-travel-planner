require('dotenv').config()
const fetch = require('node-fetch')

// DarSky Api to fetch weather forecast
module.exports.fetchCityForeCast = async (lat, lng, time) => {
  const {DARKSKY_BASEURL, DARKSKY_APIKEY} = process.env
  const darkSkyTime = new Date(time).getTime() / 1000
  try {
    let weather = {}
    const result = await fetch(
      `${DARKSKY_BASEURL}/${DARKSKY_APIKEY}/${lat},${lng},${darkSkyTime}/?exclude=currently,flags,hourly,alerts,minutely&units=si`,
    )
    const {daily} = await result.json()
    // Checking for error cases from the API or empty fields
    const completeForecast = daily && daily.data[0]
    if (completeForecast) {
      const {summary, temperatureMax, temperatureMin, icon} = completeForecast
      weather = {summary, high: temperatureMax, low: temperatureMin, icon}
    }
    return weather
  } catch (e) {
    throw e
  }
}
