const deviceContainer = document.getElementById('deviceContainerList');
deviceContainer.innerHTML = "";

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', async () => {
    logout();
});

const deviceLinkPopup = document.getElementById('deviceLinkPopup');
deviceLinkPopup.style.display = "none";

const linkBoardDeviceButton = document.getElementById('linkBoardDeviceButton');
linkBoardDeviceButton.addEventListener('click', async () => {
    deviceLinkPopup.style.display = "flex";
});

const linkDeviceButton = document.getElementById('linkDeviceButton');
linkDeviceButton.addEventListener('click', async () => {
    deviceLinkPopup.style.display = "none";

    const deviceId = document.getElementById('deviceId').value;
    linkDevice(deviceId);
});

const closeLinkDevicePopup = document.getElementById('closePopupButton');
closeLinkDevicePopup.addEventListener('click', async () => {
    deviceLinkPopup.style.display = "none";
});

async function logout()
{
    try {
        const response = await fetch(`https://iot-light-tracker.onrender.com/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Logout failed:', error.message);
            alert(`Error: ${error.message}`);
            return;
        }

        window.location.href = "login.html";
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

async function linkDevice(id)
{
    try {
        const response = await fetch(`https://iot-light-tracker.onrender.com/device/link/${id}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Link successful:', data);

            getDevices();
        } else {
            const error = await response.json();
            console.error('Link failed:', error.message);
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error while linking device:', error);
        alert(`Error: ${error.message}`);
    }
}

async function unlinkDevice(id)
{
    try {
        const response = await fetch(`https://iot-light-tracker.onrender.com/device/unlink/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Unlink successful:', data);

            getDevices();
        } else {
            const error = await response.json();
            console.error('Unlink failed:', error.message);
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error while unlinking device:', error);
        alert(`Error: ${error.message}`);
    }
}

getDevices();

async function getDevices()
{
    deviceContainer.innerHTML = "";

    try {
        const response = await fetch(`https://iot-light-tracker.onrender.com/device/`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const devicesData = await response.json();
            console.log('Get Devices successful:', devicesData);
            devicesData.forEach(device => {
                displayDeviceInfo(device);
            });
        } else {
            const error = await response.json();
            console.error('Get Devices failed:', error.message);
            if (response.status == 500) {
                window.location.href = "login.html";
            }
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error while getting devices:', error);
        alert(`Error: ${error.message}`);
    }
};

async function displayDeviceInfo(deviceInfo)
{
    const deviceDiv = document.createElement('div');
    deviceDiv.className = 'device-container';

    deviceDiv.innerHTML = `
        <div class='device-card'> 
            <img src='assets/d1_mini_pro.png' alt='Avatar' style='width:100%'>
            <div class='device-card-info'> 
                <p>ID: ${deviceInfo.id}
                <br>Type: ${deviceInfo.type}
            </div>
        </div>
        <div class='device-chart'>
            <canvas id='chart-${deviceInfo.id}'></canvas>
        </div>
        <div class='device-threshold'>
            <p>Current alert threshold: ${deviceInfo.threshold}</p>
            <input type="number" 
                class="ele"
                id="deviceThreshold" 
                placeholder="Device Threshold">
            <button class="clkbtn" id="setThresholdDeviceButton">Update Threshold</button>
            <button id="unlinkDeviceButton" class="red-button">Unlink Device</button>
        </div>
    `;

    deviceContainer.appendChild(deviceDiv);

    deviceDiv.querySelector("#setThresholdDeviceButton").addEventListener('click', async () => {
        const deviceThreshold = document.getElementById('deviceThreshold').value;
        setDeviceAlertsThreshold(deviceInfo.id, deviceThreshold);
    });

    deviceDiv.querySelector("#unlinkDeviceButton").addEventListener('click', async () => {
        unlinkDevice(deviceInfo.id);
    });

    const sensorData = await getDeviceSensorData(deviceInfo.id);
    if (sensorData.length == 0) {
        return;
    }

    let dates = sensorData.map(item => new Date(item.timestamp).toLocaleString());
    let values = sensorData.map(item => item.value);

    const canvas = deviceDiv.querySelector(`#chart-${deviceInfo.id}`);
    const ctx = canvas.getContext('2d');

    let myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: `Device ${deviceInfo.id}`,
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

async function getDeviceSensorData(deviceId) {
    try {
        const response = await fetch(`https://iot-light-tracker.onrender.com/sensor-datas/${deviceId}`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            alert(`Error: ${error.message}`);
            console.error('Error:', error);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
        return [];
    }
}

async function setDeviceAlertsThreshold(deviceId, threshold) {
    const requestBody = {
        deviceId: deviceId,
        value: threshold
    };

    try {
        const response = await fetch(`https://iot-light-tracker.onrender.com/alerts/threshold`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (!response.ok) {
            alert(`Error: ${data.message}`);
            console.error('Error:', data);
        }
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}


