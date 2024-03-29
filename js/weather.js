// Line plots
// https://plotly.com/javascript/line-charts/
// https://www.chartjs.org/docs/latest/samples/line/line.html


const APPID = '4b82b3b40e9f7a693087eab5ee7b5044'


window.onload = function () {
    // Hide panel until user has searched
    document.querySelector('.main-panel').classList.add('hidden')

    SetBackground()
    AddSearchListener()
    AddButtonListeners()

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

function WeatherSearch(lat, lon, country) {
    showLoader()
    LocationFromCoords(lat, lon)
        .then(location => {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APPID}&units=imperial`)
                .then(response => response.json())
                .then(data => {
                    hideLoader()
                    SetUIWithData(data, location, country)
                    LoadGraph(data.hourly)
                })
        })
    .catch(e => console.log(e))
}

function hideLoader() {
    let loader = document.querySelector('div.loader')
    loader.classList.remove('show')
    loader.classList.add('hide')
}

function showLoader() {
    if (window.loaded == undefined) {
        window.loaded = true
        let loader = document.querySelector('div.loader')
        loader.classList.remove('hide')
        loader.classList.add('show')
    }
}

function AddButtonListeners() {
    document.querySelector('#details-btn').addEventListener('click', function () {
        document.querySelector('#details-btn').classList.add('active')
        document.querySelector('#forecast-btn').classList.remove('active')
        document.querySelector('#graph-btn').classList.remove('active')

        document.querySelector('.sliding-panels').classList.remove('forecast')
        document.querySelector('.sliding-panels').classList.remove('graph')
        document.querySelector('.sliding-panels').classList.add('detail')
    })
    document.querySelector('#forecast-btn').addEventListener('click', function () {
        document.querySelector('#forecast-btn').classList.add('active')
        document.querySelector('#details-btn').classList.remove('active')
        document.querySelector('#graph-btn').classList.remove('active')

        document.querySelector('.sliding-panels').classList.remove('detail')
        document.querySelector('.sliding-panels').classList.remove('graph')
        document.querySelector('.sliding-panels').classList.add('forecast')
    })
    document.querySelector('#graph-btn').addEventListener('click', function () {
        document.querySelector('#graph-btn').classList.add('active')
        document.querySelector('#forecast-btn').classList.remove('active')
        document.querySelector('#details-btn').classList.remove('active')

        document.querySelector('.sliding-panels').classList.remove('detail')
        document.querySelector('.sliding-panels').classList.remove('forecast')
        document.querySelector('.sliding-panels').classList.add('graph')
    })
}

function SetBackground(date) {
    let hours
    if (!date) {
        hours = new Date().getHours()
    }
    console.log(hours)
    let greeting = ''
    if (0 <= hours && hours < 12) {
        greeting = 'Good Morning'
        document.querySelector('body').classList.add('morning')
    }
    else if (12 <= hours && hours < 18) {
        greeting = 'Good Afternoon'
        document.querySelector('body').classList.add('afternoon')
    }
    else if (18 <= hours && hours <= 23) {
        greeting = 'Good Evening'
        document.querySelector('body').classList.add('evening')
    } else {
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

function SetUIWithData(data, location, country) {
    console.log(data, data.current)
    // Set Image
    let imageHTML = `<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="weather icon">`
    document.querySelector('#image-container').innerHTML = imageHTML

    // Set location
    let countryDisplay = country == undefined ? 'US' : country
    let locationInnerHTML = `<strong id="location">${location}</strong>, ${countryDisplay}`
    document.querySelector('#location').innerHTML = locationInnerHTML

    // Set weather condition
    document.querySelector('#condition-text').textContent = data.current.weather[0].description
    document.querySelector('title').textContent = `${location}, ${countryDisplay} - ` + Math.floor(data.current.temp) + '°'

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

    // UV Index
    document.querySelector('#uv').textContent = data.current.uvi

    // Clouds
    document.querySelector('#clouds').textContent = data.current.clouds

    // Show Panel
    document.querySelector('.main-panel').classList.remove('hidden')

    CreateHourlyWeather(data)
    CreateDailyForecast(data)
}

function CreateDailyForecast(data) {
    // Create daily weather
    const hourComponent = (data) => {
        var options = { weekday: 'long' };
        var today = new Date(data.dt * 1000)

        let dateString = Array.from(today.toLocaleDateString('en-US', options)).splice(0, 3).join('')
        return `
            <div class="day">${dateString} ${today.getDate()}</div>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="small weather icon" width="80px">
            <div>${data.weather[0].main}</div>
            <div class="temp">L: ${Math.floor(data.temp.min)}°</div>
            <div class="temp">H: ${Math.floor(data.temp.max)}°</div>
        `
    }

    // Remove previous elements
    document.querySelector('#daily').innerHTML = ''

    for (let day of data.daily) {
        let elem = document.createElement('div')
        elem.id = 'day'
        elem.classList.add('daily-row')
        elem.innerHTML = hourComponent(day)
        if (day == data.daily[0]) {
            elem.querySelector('.day').innerHTML = 'Today'
        }
        document.querySelector('#daily').appendChild(elem)
    }
}

function CreateHourlyWeather(data) {
    // Create hourly weather
    const hourComponent = (data) => {
        let date = new Date(data.dt * 1000)
        let parsedDate = to12Hour(date, true)
        return `
            <div class="high">${Math.floor(data.temp)}°</div>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="small weather icon" width="40px">
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
        if (i == 0) {
            elem.classList.add('current')
            elem.querySelector('.low').textContent = 'Now'
        }
        document.querySelector('#hourly').appendChild(elem)
    }
}

function AddSearchListener() {
    const form = document.querySelector('#form')

    let input = document.querySelector('#input')
    input.addEventListener('focus', (event) => {
        hideErrorMessage()
    })

    form.addEventListener('submit', (event) => {
        event.preventDefault()
        input.blur()

        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input.value}&limit=1&appid=${APPID}&units=imperial`)
            .then(response => response.json())
            .then(data => WeatherSearch(data[0].lat, data[0].lon, data[0].country))
            .catch(e => {
                showErrorMessage('City Not Found')
            })
    })
}


function hideErrorMessage() {
    document.querySelector('#error').classList.add('hidden')
}

function LocationFromCoords(lat, lon) {
    return fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${APPID}&units=imperial`)
        .then(response => response.json())
        .then(data => data[0].name)
}

function showErrorMessage(error) {
    document.querySelector('#error').classList.remove('hidden')
    document.querySelector('#error').textContent = error
}