const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      await navigator.serviceWorker.register("sw.js");
      console.log('Service worker registered');
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    // Get vapid public key
    const publickey = await fetch('https://iot-light-tracker.onrender.com/pwa/vapid-key', {
      method: 'GET',
      credentials: "include"
    }).then(response => response.json()).then(data => {
      return data.publickey;
    })
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publickey
    });

    // Send new subscription
    await fetch('https://iot-light-tracker.onrender.com/pwa/subscribe', {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({subscription: sub})
    })
    console.log('Subscribed to notification');
  } else {
    // Send current subscription
    await fetch('https://iot-light-tracker.onrender.com/pwa/subscribe', {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({subscription: subscription})
    })
    console.log('Already subscribed to notificaction')
  }
}

window.onload = () => {
  registerServiceWorker();
}

const subButton = document.getElementById('subscribeButton');

subButton.addEventListener("click", (event) => {
  subscribeToPush();
});
