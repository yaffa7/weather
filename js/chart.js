function LoadGraph(weatherData) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if(window.chart == undefined) {
        CreateGraph(weatherData, ctx)
    } else {
        UpdateGraph(weatherData)
    }
}

function UpdateGraph(weatherData) {
    let chartData = CreateChartData(weatherData);
    for(let i = 0; i< window.chart.data.datasets.length;i++) {
        window.chart.data.datasets[i].data = chartData.datasets[i]
    }
    window.chart.update()
}

function CreateGraph(weatherData, ctx) {
    Chart.defaults.font.size = 16;
    Chart.defaults.borderColor = 'rgba(255, 255, 255,.2)';
    Chart.defaults.color = 'rgb(255, 255, 255)';
    Chart.defaults.font.family = "'Nunito', sans-serif";

    let chartData = CreateChartData(weatherData);

    const data = {
        labels: chartData.labels,
        datasets: [{
            label: 'Tempurature',
            data: chartData.datasets[0],
            fill: false,
            borderColor: 'rgb(255, 255, 255)',
            tension: 0.1
        },
        {
            label: 'Humidity',
            data: chartData.datasets[1],
            fill: false,
            borderColor: 'rgb(122, 122, 122)',
            tension: 0.1
        },
        {
            label: 'UV Index',
            data: chartData.datasets[2],
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

function CreateChartData(weatherData) {

    const MAX_HOURS = 24;
    const labels = [];
    const tempData = [];
    const humidityData = [];
    const uvData = [];

    for (let i = 0; i < MAX_HOURS; i++) {
        let d = weatherData[i];
        let date = new Date(d.dt * 1000);
        let parsedDate = to12Hour(date, true);
        labels.push(parsedDate);
        tempData.push(d.temp);
        humidityData.push(d.humidity);
        uvData.push(d.uvi * 10);
    }

    return {
        datasets: [
            tempData, 
            humidityData, 
            uvData,
        ],
        labels: labels
    }
}
