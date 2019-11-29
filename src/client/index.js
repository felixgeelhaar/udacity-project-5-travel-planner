// import styles
import './styles/reset.css'
import './styles/styles.sass'
import './styles/search.sass'
import './styles/trip.sass'

import pixabayImage from './media/pixabay-logo.png'

// import main function
import {renderTrips} from './js/trips'
import {renderSearch} from './js/search'

// calls the render functions from trips and search
renderTrips()
renderSearch()

// Checks if serviceworker is available
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
  })
}

// Initial check if offline
if (!navigator.onLine) {
  showOfflineMessage()
}

// Event listener for being online again
window.addEventListener('online', () => {
  const elements = retrieveInputs()
  elements.forEach(el => {
    if (el.hasAttribute('id')) {
      el.removeAttribute('disabled')
    }
  })
  removeOfflineMessage()
})

// Event listener for being offline
window.addEventListener('offline', () => {
  const elements = retrieveInputs()
  elements.forEach(el => {
    el.setAttribute('disabled', 'disabled')
  })
  showOfflineMessage()
})

// removes the message when user turn online again
const removeOfflineMessage = () => {
  const offline = document.getElementById('offline')
  if (offline) {
    offline.remove()
  }
}

// shows an message at the top of the page that the user turned offline
const showOfflineMessage = () => {
  const first = document.querySelector('main')
  if (document.getElementById('offline')) {
    return
  }
  const offline = "<p id='offline'>You seem to be offline!</p>"
  first.insertAdjacentHTML('afterbegin', offline)
}

// Disable all inputs and buttons
const retrieveInputs = () => {
  const buttons = document.querySelectorAll('button')
  const inputs = document.querySelectorAll('input')
  return [...inputs, ...buttons]
}

// add the image src to the footer image element
const pixabay = document.getElementById('pixabay')
pixabay.setAttribute('src', pixabayImage)
