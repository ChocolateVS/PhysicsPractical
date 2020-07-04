///USING CHART JS
/*console.log(pointsArray);
    var ctx = document.getElementById('myChart').getContext('2d');
    var scatterChart = new Chart(ctx, {
    type: 'scatter',
        data: {
            datasets: [{
                label: dataLabel,
                data: 
                    pointsArray,
                backgroundColor: 'rgba(255, 30, 255, 0.6)',
                borderColor: 'rgba(255, 30, 255, 1)',
                borderWidth: 1,
                pointWidth: 3
            }],
            
        },
        options: {
            title: {
                display: true,
                text: graphName
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: yAxisTitle
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: xAxisTitle
                    },
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        beginAtZero: true
                    }     
                }]
            },
            plugins: {
                datalabels: {
                    display: false,
                },
              chartJsPluginErrorBars: {
                width: '60%',
                //color: 'darkgray'
              }
            },
            annotation: {
              annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'yAxes',
                value: 2225,
                endValue: 0,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 4,
                label: {
                  enabled: true,
                  content: 'Trendline',
                  yAdjust: -16,
                }
              }]
            }
        }
    });*/