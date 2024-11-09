import webpush from 'web-push';
 
export function sendNotification(subscription: any, message: string, vapid: any) {
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

    webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
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