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
    console.log('Device ID:', self.deviceId);
    fetch('http://localhost:4000/device/ping', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({deviceId: self.deviceId, value: "0"})
    });
  }
});