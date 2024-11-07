async function getData() {
    const response = await fetch('data/loss.csv');
    const data = await response.text();
    // console.log(data);

    const xEpochs = []; // x-axis labels (Epochs)
    const yTrain = []; // y-axis labels (Training Loss)
    const yVal = []; // y-axis labels (Validation Loss)

    const table = data.split('\n').slice(1); // split data by new line and remove header

    table.forEach(row => {
        const columns = row.split(',');
        const epoch = parseInt(columns[0]);
        xEpochs.push(epoch);

        const trainingLoss = parseFloat(columns[1]);
        yTrain.push(trainingLoss);

        const validationLoss = parseFloat(columns[2]);
        yVal.push(validationLoss);
    });

    return { xEpochs, yTrain, yVal };
}

async function createChart() {
    const lossChart = document.getElementById('lossChart');
    const data = await getData();

    console.log(data);

    const myChart = new Chart(lossChart, {
        type: "line",
        data: {
            labels: data.xEpochs,
            datasets: [
                {
                    label: "Training Loss",
                    data: data.yTrain,
                    fill: false,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Validation Loss",
                    data: data.yVal,
                    fill: false,
                    backgroundColor: "rgba(123, 0, 255, 0.2)",
                    borderColor: "rgba(123, 0, 255, 1)",
                    borderWidth: 1,
                },
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Epochs",
                        font: {
                            size: 16,
                            family: "DM Sans"
                        }
                    },
                    ticks: {
                        callback(val, index) {
                            return index % 10 === 0 ? this.getLabelForValue(val) : ""
                        },
                        font: { size: 10 }
                    },
                    grid: {
                        color: "#6c767e"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Loss Value',        // y-axis title
                        font: {
                            size: 16,
                            family: "DM Sans"
                        }
                    },

                    ticks: {
                        maxTicksLimit: data.yVal.length,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: "#6c767e"
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: "Chart of Model's Training and Validation Loss during Ten Epochs",
                    font: {
                        size: 30,
                        family: "DM Sans"
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    align: "center",
                    position: "bottom"
                }
            }
        }
    });
}

Chart.defaults.color = '#000';

createChart();