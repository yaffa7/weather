
window.onload = function () {
    document.querySelector('.main-panel').classList.add('hidden')
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
    var options = { weekday: 'long', day: 'numeric' , month: 'long'};
    var today  = new Date();

    let dateString = today.toLocaleDateString("en-US", options)
    document.querySelector('#current-date').textContent = dateString

    const form = document.querySelector('#form')
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        let search = document.querySelector('#input').value
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search},US&appid=4b82b3b40e9f7a693087eab5ee7b5044&units=imperial`)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            // Set Image
            let imageHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" width="100px" height="100px">`
            document.querySelector('#image-container').innerHTML = imageHTML

            // Set location
            let locationInnerHTML = `<strong id="location">${data.name}</strong>, ${data.sys.country}`
            document.querySelector('#location').innerHTML = locationInnerHTML

            // Set weather condition
            document.querySelector('#condition-text').textContent = data.weather[0].description

            // Set Current tempurature
            document.querySelector('#current-temp').textContent = Math.floor(data.main.temp) + '°'

            // Wind Speed
            document.querySelector('#wind').textContent = data.wind.speed + ' mph'

            // Real Feel
            document.querySelector('#feel').textContent = data.main.feels_like + '°'

            // Pressure
            document.querySelector('#pressure').textContent = data.main.pressure + '°'

            // Max Temp
            document.querySelector('#high').textContent = data.main.temp_max + '°'

            // Min Temp
            document.querySelector('#low').textContent = data.main.temp_min + '°'

            // Humidity
            document.querySelector('#humidity').textContent = data.main.humidity + '%'

            // Show Panel
            document.querySelector('.main-panel').classList.remove('hidden')

            // Move Search
            document.querySelector('.search-container').classList.add('searched')
        })
    })
}