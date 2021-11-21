function LoadGraph(weatherData) {
    console.log('Loading graph with weather data')
    const ctx = document.getElementById('myChart').getContext('2d');
    console.log(window.chart)
    if(window.chart == undefined) {
        CreateGraph(weatherData, ctx)
    } else {
        UpdateGraph()
    }
}

function UpdateGraph() {

}

function CreateGraph(weatherData, ctx) {
    Chart.defaults.font.size = 16;
    Chart.defaults.borderColor = 'rgba(255, 255, 255,.2)';
    Chart.defaults.color = 'rgb(255, 255, 255)';
    Chart.defaults.font.family = "'Nunito', sans-serif";


    const MAX_HOURS = 24;
    const labels = [];
    const tempData = [];
    const humidityData = [];
    const uvData = [];

    CreateLabelsAndData(MAX_HOURS, weatherData, labels, tempData, humidityData, uvData);
    const data = {
        labels: labels,
        datasets: [{
            label: 'Tempurature',
            data: tempData,
            fill: false,
            borderColor: 'rgb(255, 255, 255)',
            tension: 0.1
        },
        {
            label: 'Humidity',
            data: humidityData,
            fill: false,
            borderColor: 'rgb(122, 122, 122)',
            tension: 0.1
        },
        {
            label: 'UV Index',
            data: uvData,
            fill: false,
            borderColor: 'rgb(141, 0, 0)',
            tension: 0.1
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            plugins: {
                legend: {
                    color: 'white',
                    display: true,
                    labels: {
                        font: {
                            size: 24,
                            family: "'Nunito', sans-serif"
                        },
                        color: 'white'
                    }
                }
            }
        }
    }

    window.chart = new Chart(ctx, config);
}

function CreateLabelsAndData(MAX_HOURS, weatherData, labels, tempData, humidityData, uvData) {
    for (let i = 0; i <= MAX_HOURS; i++) {
        let d = weatherData[i];
        let date = new Date(d.dt * 1000);
        let parsedDate = to12Hour(date, true);
        labels.push(parsedDate);
        tempData.push(d.temp);
        humidityData.push(d.humidity);
        uvData.push(d.uvi);
    }
}
