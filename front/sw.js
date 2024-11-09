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
  console.log('User closed the notification');
  fetch('http://localhost:4000/device/ping', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({deviceId: self.deviceId, value: "0"})
  });
});