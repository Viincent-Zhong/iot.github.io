const deviceContainer = document.getElementById('deviceContainerList');

deviceContainer.innerHTML = "";

for (const device of user_data["devices"]) {
    const deviceDiv = document.createElement('div');
    deviceDiv.className = 'device-container';

    deviceDiv.innerHTML = `
        <div class='device-card'> 
            <img src='assets/d1_mini_pro.png' alt='Avatar' style='width:100%'>
            <div class='device-card-info'> 
                <p>ID: ${device["id"]}
                <br>Type: ${device["type"]}
                <br>Status: ${device["status"]}</p>
            </div>
        </div>
        <div class='device-chart'>
            <canvas id='chart-${device["id"]}'></canvas>
        </div>
    `;

    deviceContainer.appendChild(deviceDiv);

    let dates = device["data"].map(item => item.date);
    let values = device["data"].map(item => item.value);

    const canvas = deviceDiv.querySelector(`#chart-${device["id"]}`);
    const ctx = canvas.getContext('2d');

    let myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: `Device ${device["id"]}`,
                data: values,
                borderColor: 'blue',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
      });
}