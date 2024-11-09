console.log('Sw registered');

self.addEventListener('push', (e) => {
  let message = e.data.json();

  console.log(message)
  e.waitUntil(
      registration.showNotification(message.title, {
        body: message.body,
        icon: message.icon
      })
  )
  self.deviceId = message.deviceId
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  fetch('http://localhost:4000/device/ping', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({deviceId: self.deviceId, value: "0"})
  });
});