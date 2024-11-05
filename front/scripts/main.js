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
      await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log('Service worker registered');
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.getSubscription();
  // If not subscribe cookie
    // Generate vapid key
    // Send vapid key to server
    // => Cookie
  // if (!subscription) {
    // const sub = await registration.pushManager.subscribe({
      // userVisibleOnly: true,
      // applicationServerKey: urlBase64ToUint8Array("BE5FT85ofqoMmd1odJcdp_ESohzWLJbvE1_StxgEXhmo9dyw_8CvpHMOeCd8sGyVTbB0zoOLhGUIlcP79ubUr6M")
    // });
    // console.log('Subscribed to notification');
  // } else {
    // console.log('Already subscribed to notificaction')
  // }
}

window.onload = () => {
  registerServiceWorker();
}