function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\\-/g, '+')
    .replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      await navigator.serviceWorker.register("sw.js", {
        scope: "/",
      });
      console.log('Service worker registered');
    } catch (error) {
      
      console.error(error);
      console.error(`Registration failed with ${error}`);
    }
  }
};

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    // Get vapid public key
    const publickey = await fetch('http://localhost:4000/pwa/vapid-key', {
      method: 'GET',
      credentials: "include"
    }).then(response => response.json()).then(data => {
      return data.publickey;
    })
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publickey)
    });

    // Send new subscription
    await fetch('http://localhost:4000/pwa/subscribe', {
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
    await fetch('http://localhost:4000/pwa/subscribe', {
      method: 'GET',
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

const subButton = document.getElementById('sub');

subButton.addEventListener("click", (event) => {
  subscribeToPush();
});
