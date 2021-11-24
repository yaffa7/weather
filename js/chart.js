function LoadGraph(weatherData) {
    const ctx = document.getElementById('chart-desktop').getContext('2d');
    const ctx2 = document.getElementById('chart-mobile').getContext('2d');
    if(window.chart == undefined && window.chart2 == undefined) {
        CreateGraph(weatherData, ctx, ctx2)
    } else {
        UpdateGraph(weatherData, window.chart)
        UpdateGraph(weatherData, window.chart2)
    }
}

function UpdateGraph(weatherData, chart) {
    let chartData = CreateChartData(weatherData);
    for(let i = 0; i< window.chart.data.datasets.length;i++) {
        window.chart.data.datasets[i].data = chartData.datasets[i]
    }
    chart.update()
}

function CreateGraph(weatherData, ctx, ctx2) {
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
    window.chart2 = new Chart(ctx2, config);

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
