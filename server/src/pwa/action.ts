 import webpush from 'web-push';
 
// let subscription: webpush.PushSubscription | null = null


// webpush.setVapidDetails(
    // "mailto: <ok@gmail.com>",
    // "BE5FT85ofqoMmd1odJcdp_ESohzWLJbvE1_StxgEXhmo9dyw_8CvpHMOeCd8sGyVTbB0zoOLhGUIlcP79ubUr6M",
    // "ttqlvyNTZWPk-UJ1bM5-2CThjYgTBtyK-MyS9H8eRzc"
// );

// export async function setSubscriber(sub: any) {
//   subscription = JSON.parse(sub)
//   return {success: true}
// }

// export async function sendNotification(message: any) { 
//   if (!subscription)
//     return { success: false};

//   console.log(subscription)
//   try {
//     await webpush.sendNotification(
//       subscription,
//       JSON.stringify({
//         title: 'Test Notification',
//         body: message,
//         icon: '/icon.png',
//       })
//     );
//     console.log('Sent notification');
//     return { success: true };
//   } catch (error) {
//     console.error('Error sending push notification:', error);
//     return { success: false, error: 'Failed to send notification' };
//   }
// }