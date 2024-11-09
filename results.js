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

let myChart = null;

function getAspectRatio() {
    const viewportWidth = window.innerWidth;

    if (viewportWidth < 768) { 
        return 1; 
    } else {
        return 2;
    }
}

async function createChart() {
    const lossChart = document.getElementById('lossChart');
    const data = await getData();
    
    if (myChart) {
        myChart.destroy();
    }
    
    myChart = new Chart(lossChart, {
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
            maintainAspectRatio: true,
            aspectRatio: getAspectRatio(), // Dynamically set aspect ratio
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Epochs",
                        font: {
                            size: window.innerWidth < 768 ? 14 : 16,
                            family: "DM Sans"
                        }
                    },
                    ticks: {
                        callback(val, index) {
                            return index % 10 === 0 ? this.getLabelForValue(val) : ""
                        },
                        font: { size: window.innerWidth < 768 ? 8 : 10 }
                    },
                    grid: {
                        color: "#6c767e"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Loss Value',
                        font: {
                            size: window.innerWidth < 768 ? 14 : 16,
                            family: "DM Sans"
                        }
                    },
                    ticks: {
                        maxTicksLimit: data.yVal.length,
                        font: {
                            size: window.innerWidth < 768 ? 14 : 16
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
                    text: ["Chart of Model's Training and Validation Loss during Ten Epochs"],
                    font: {
                        size: window.innerWidth < 768 ? 20 : 30,
                        family: "DM Sans"
                    },
                    padding: {
                        top: 10,
                        bottom: window.innerWidth < 768 ? 20 : 30
                    }
                },
                legend: {
                    align: "center",
                    position: "bottom",
                    labels: {
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12
                        }
                    }
                }
            }
        }
    });
}

Chart.defaults.color = '#000';

// Add resize handler with debouncing (prevents rendering too many times)
window.addEventListener('resize', debounce(() => {
    createChart();
}, 5));

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initial chart creation
createChart();