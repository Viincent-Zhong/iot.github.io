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
        const response = await fetch(`${serverPath}logout`, {
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
        const response = await fetch(`${serverPath}device/link/${id}`, {
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
    console.log('UnLinking : ', id);
    try {
        const response = await fetch(`${serverPath}device/unlink/${id}`, {
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
        const response = await fetch(`${serverPath}device/`, {
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

            updateCollapsibles();
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

function updateCollapsibles()
{
    let coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            } 
        });
    }
}

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
        </div>
        <div class='device-alerts'>
            <button type="button" class="collapsible">Previous alerts</button>
            <div class="device-alerts-content" id="deviceAlertsContent"></div>
        </div>
        <div class="device-unlink">
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
    if (sensorData.length > 0) {
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

    const alertsData = await getDeviceAlertsData(deviceInfo.id);
    if (alertsData.length > 0 && alertsData[0].alerts.length > 0) {
        let deviceAlertsContent = deviceDiv.querySelector("#deviceAlertsContent");
        
        alertsData[0].alerts.forEach(deviceAlert => {
            console.log(deviceAlert);
            const deviceAlertDiv = document.createElement('p');
            deviceAlertDiv.className = 'device-alerts-data';
            deviceAlertDiv.innerHTML = `${new Date(deviceAlert.timestamp).toLocaleString()} - Alert threshold: ${deviceAlert.value}`; 
            deviceAlertsContent.appendChild(deviceAlertDiv);
        });
    }
}

async function getDeviceSensorData(deviceId) {
    try {
        const response = await fetch(`${serverPath}sensor-datas/${deviceId}`, {
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
        const response = await fetch(`${serverPath}alerts/threshold`, {
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

async function getDeviceAlertsData(deviceId) {
    try {
        const response = await fetch(`${serverPath}alerts/${deviceId}`, {
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

