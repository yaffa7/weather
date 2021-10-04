
window.onload = function () {
    console.log(new Date().getMonth())
    let hours = new Date().getHours()
    console.log('Hours:', hours)
    if (6 < hours && hours < 12) {
        console.log('Good Morning')
    }
    if (12 < hours && hours < 18) {
        console.log('Good Afternoon')
    }
    if (18 < hours && hours < 24) {
        console.log('Good Evening')
    }
    fetch('https://api.openweathermap.org/data/2.5/weather?q=San Diego,US&appid=4b82b3b40e9f7a693087eab5ee7b5044&units=imperial')
        .then(response => response.json())
        .then(data => {
            console.log(data)

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
        })

}