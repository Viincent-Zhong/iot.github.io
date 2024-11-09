console.log('Sw registered');

self.addEventListener('push', (e) => {
  let message = e.data.json();

  e.waitUntil(
      registration.showNotification(message.title, {
        body: message.body,
        icon: message.icon
      })
  )
  self.deviceId = message.deviceId
})

self.addEventListener('notificationclose', (e) => {
  if (self.deviceId) {
    fetch('https://iot-light-tracker.onrender.com/device/ping', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({deviceId: self.deviceId, value: "0"})
    });
  }
});