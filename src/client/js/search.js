import {getTrips} from './trips'

export const renderSearch = async () => {
  setMinDate()
  handleForm()
}

// Set the minimum date of the search-trip-date input field dynamically
const setMinDate = () => {
  const date = new Date()
  const minDate = `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`

  const departDate = document.getElementById('search-trip-date')
  departDate.setAttribute('min', minDate)
}

// Add all necessary event handlers for the formular
const handleForm = () => {
  const save = document.getElementById('search-trip-save')
  const reset = document.getElementById('search-trip-reset')
  const form = document.getElementById('search-trip-form')
  const input = document.getElementById('search-trip-location')

  form.addEventListener('submit', handleSubmit)
  input.addEventListener('input', handleInput)
  save.addEventListener('click', handleSubmit)
  reset.addEventListener('click', () => form.reset())
}

// Saves a trip in the API layer and fetches all trips again for consistency
const saveTrip = async (location, date) => {
  const result = await fetch('http://localhost:3000/trip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({location, date}),
  })
  if (!result.ok) {
    setFormError("We weren't able to save your trip. Please try again.")
  } else {
    const form = document.getElementById('search-trip-form').reset()
    getTrips()
  }
}

// Helper to set the error for the form
const setFormError = message => {
  const form = document.getElementById('search-trip-form')
  const error = `<p id='search-trip-error'>${message ||
    'Please provide location and date'}</p>`

  form.insertAdjacentHTML('afterbegin', error)
}

// Helper to remove the error for the form
const removeFormError = () => {
  const error = document.getElementById('search-trip-error')
  error && error.remove()
}

// Helper function to create a datalist for the proposals of the cities
const createDataList = proposals => {
  removeDataList()
  const input = document.getElementById('search-trip-location')
  input.insertAdjacentHTML(
    'afterend',
    '<datalist id="search-trip-locations"></datalist>',
  )
  const dataList = document.getElementById('search-trip-locations')
  proposals.forEach(({location}) =>
    dataList.insertAdjacentHTML(
      'beforeend',
      `<option value="${location}">${location}</option>`,
    ),
  )
}

// Helper function to remove the datalist again to avoid multiple datalists
const removeDataList = () => {
  const dataList = document.getElementById('search-trip-locations')
  dataList && dataList.remove()
}

// Fetches city proposals from the API on input in case of more than 4 chars
const handleInput = async e => {
  const {value} = e.target
  if (value.length >= 4) {
    return
  }
  const result = await fetch(`http://localhost:3000/proposals?term=${value}`)
  const proposals = await result.json()
  createDataList(proposals)
}

// The function to save a trip or set an error
const handleSubmit = e => {
  e.preventDefault()
  removeFormError()
  const location = document.getElementById('search-trip-location').value
  const date = document.getElementById('search-trip-date').value
  if (location && date) {
    saveTrip(location, date)
  } else {
    setFormError()
  }
}
