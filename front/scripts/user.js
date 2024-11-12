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

const linkDeviceButton = document.getElementById('linkDeviceButton');
linkDeviceButton.addEventListener('click', async () => {
    const deviceId = document.getElementById('deviceId').value;
    linkDevice(deviceId);
});

async function linkDevice(id)
{
    try {
        const response = await fetch(`http://localhost:4000/device/link/${deviceId}`, {
            method: 'POST',
            credentials: 'include', // This ensures cookies are sent with the request
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Link successful:', data);

            getDevices();
        } else {
            const errorData = await response.json();
            console.error('Link failed:', errorData.message);
        }
    } catch (error) {
        console.error('Error while linking device:', error);
    }
}

getDevices();

async function getDevices()
{
    try {
        const response = await fetch(`http://localhost:4000/device/`, {
            method: 'GET',
            credentials: 'include', // This ensures cookies are sent with the request
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Get Devices successful:', data);
        } else {
            const errorData = await response.json();
            console.error('Get Devices failed:', errorData.message);
        }
    } catch (error) {
        console.error('Error while getting devices:', error);
    }
};


