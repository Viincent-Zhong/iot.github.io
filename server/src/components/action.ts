import webpush from 'web-push';
 
export function sendNotification(subscription: any, message: string, vapid: any, deviceId: any) {
  try {
    const parsedUrl = new URL(subscription.endpoint);
    const audience = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    const vapidHeaders = webpush.getVapidHeaders(
      audience,
      vapid.mailto,
      vapid.publicKey,
      vapid.privateKey,
      'aes128gcm'
    );

    // Peut etre envoyer les détails (deviceid)
    webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Alert notification',
        body: message,
        icon: '/icon.png',
        deviceId: deviceId
      }),
      {
        headers: vapidHeaders
      }
    );
    console.log('Sent notification');
    return;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return;
  }
}