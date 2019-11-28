const departDate = document.getElementById('depart-date')
const date = new Date()
const value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
departDate.setAttribute('min', value)
