const APPID = '4b82b3b40e9f7a693087eab5ee7b5044'


window.onload = function () {
    // Hide panel until user has searched
    document.querySelector('.main-panel').classList.add('hidden')

    SetBackground()
    AddSearchListener()

    function success(pos) {
        console.log('Got Coordinates', pos.coords)
        let lat = pos.coords.latitude
        let lon = pos.coords.longitude
        WeatherSearch(lat, lon)
    }

    function error(e) {
        console.log(e)
        // User will enter city name manually
    }

    // get users position
    navigator.geolocation.getCurrentPosition(success, error)
}

function WeatherSearch(lat, lon) {
    // start spinner
    // Call open weather with lat/long
    LocationFromCoords(lat, lon)
        .then(location => {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APPID}&units=imperial`)
                .then(response => response.json())
                .then(data => { SetUIWithData(data, location) })
        })
    // stop spinner
}

function SetBackground() {
    let hours = new Date().getHours()
    let greeting = ''
    if (1 <= hours && hours < 12) {
        greeting = 'Good Morning'
        document.querySelector('body').classList.add('morning')
    }
    if (12 <= hours && hours < 18) {
        greeting = 'Good Afternoon'
        document.querySelector('body').classList.add('afternoon')
    }
    if (18 <= hours && hours <= 24) {
        greeting = 'Good Evening'
        document.querySelector('body').classList.add('evening')
    }

    // Set Greeting
    document.querySelector('#greeting').textContent = greeting//greeting

    // Set Date 
    var options = { weekday: 'long', day: 'numeric', month: 'long' };
    var today = new Date();

    let dateString = today.toLocaleDateString('en-US', options)
    document.querySelector('#current-date').textContent = dateString
}

function SetUIWithData(data, location) {
    console.log(data, data.current)
    if (data.current.cod == 404) {
        console.log('Error detected')
        document.querySelector('#error').classList.remove('hidden')
        document.querySelector('#error').textContent = data.current.message
    }
    // Set Image
    let imageHTML = `<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="weather icon">`
    document.querySelector('#image-container').innerHTML = imageHTML

    // Set location
    let locationInnerHTML = `<strong id="location">${location}</strong>, US`
    document.querySelector('#location').innerHTML = locationInnerHTML

    // Set weather condition
    document.querySelector('#condition-text').textContent = data.current.weather[0].description

    // Set Current tempurature
    document.querySelector('#current-temp').textContent = Math.floor(data.current.temp) + '°'

    // Wind Speed
    document.querySelector('#wind').textContent = data.current.wind_speed + ' mph'

    // Real Feel
    document.querySelector('#feel').textContent = data.current.feels_like + '°'

    // Pressure
    document.querySelector('#pressure').textContent = data.current.pressure + '°'

    // Sunrise
    let sunrise = new Date(data.current.sunrise * 1000)
    document.querySelector('#sunrise').textContent = to12Hour(sunrise)

    // Sunset
    let sunset = new Date(data.current.sunset * 1000)
    document.querySelector('#sunset').textContent = to12Hour(sunset)

    // Humidity
    document.querySelector('#humidity').textContent = data.current.humidity + '%'

    // Show Panel
    document.querySelector('.main-panel').classList.remove('hidden')

    // Move Search
    document.querySelector('.search-container').classList.add('searched')

    // Show Search Again button
    document.querySelector('#search-again').classList.remove('hidden')


    // Create hourly weather
    const hourComponent = (data) => {
        let date = new Date(data.dt * 1000)
        let parsedDate = to12Hour(date, true)
        return `
                <div class="high">${Math.floor(data.temp)}°</div>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="small weather icon" width="40px">
                <div class="low">${parsedDate}</div>
        `
    }

    // Remove previous elements
    document.querySelector('#hourly').innerHTML = ''
    
    for (let i = 0; i < 5; i++) {
        let elem = document.createElement('div')
        elem.id = 'hour'
        elem.classList.add('hour')
        elem.innerHTML = hourComponent(data.hourly[i])
        if (i == 0) { elem.classList.add('current') }
        document.querySelector('#hourly').appendChild(elem)
    }
}

function AddSearchListener() {
    const form = document.querySelector('#form')

    let input = document.querySelector('#input')
    input.addEventListener('focus', (event) => {
        document.querySelector('#error').classList.add('hidden')
    })

    let searchAgain = document.querySelector('#search-again')
    searchAgain.classList.add('hidden')
    searchAgain.addEventListener('click', () => {
        location.reload()
    })

    form.addEventListener('submit', (event) => {
        event.preventDefault()
        input.blur()

        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input.value}&limit=1&appid=${APPID}&units=imperial`)
            .then(response => response.json())
            .then(data => WeatherSearch(data[0].lat, data[0].lon, input.value))
    })
}


function to12Hour(date, onlyHour = false) {
    let hours = ''
    let affix = ''
    let minutes = date.getMinutes()
    if (date.getHours() <= 12) {
        hours = date.getHours()
        affix = 'AM'
    }
    if (date.getHours() > 12) {
        hours = date.getHours() % 12
        affix = 'PM'
    }

    if (date.getMinutes() < 10) {
        minutes = `0${date.getMinutes()}`
    }

    if (onlyHour) {
        return `${hours} ${affix}`
    } else {
        return `${hours}:${minutes} ${affix}`
    }
}

function LocationFromCoords(lat, lon) {
    return fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${APPID}&units=imperial`)
        .then(response => response.json())
        .then(data => data[0].name)
}