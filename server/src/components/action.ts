import webpush from 'web-push';
 
export function sendNotification(subscription: any, message: string) {
  try {
    webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    );
    console.log('Sent notification');
    return;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return;
  }
}