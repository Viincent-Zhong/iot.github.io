var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/*.html',
  '/css/*',
  '/scripts/*'
];

console.log('Sw registered');

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  // e.waitUntil(
    // caches.open(cacheName).then(function(cache) {
      // return cache.addAll(filesToCache);
    // })
  // );
  // self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  // e.respondWith(
    // caches.match(e.request).then(function(response) {
      // return response || fetch(e.request);
    // })
  // );
});

self.addEventListener('push', (e: any) => {
  let message = e.data.json();

  console.log(message)
  e.waitUntil(
      registration.showNotification(message.title, {
        body: message.body,
        icon: message.icon
      })
  )
})