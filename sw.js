/* eslint-disable no-restricted-globals */

/**
 * 
 * NOTIFICATIONS TEST
 */
function receivePushNotification(event) {
  console.log("[Service Worker] Push Received.");
  console.log("[Service Worker] Push Received.");
  console.log("[Service Worker] Push Received.");
  console.log("[Service Worker] Push Received.");
  console.log("[Service Worker] Push Received.");
  console.log("[Service Worker] Push Received.");
  console.log(event);

  const { image, url, title, text, body } = event.data.json();

  const options = {
    body: text,
    icon: "https://rekrueger.github.io/archa.com/favicon.ico",
    vibrate: [200, 100, 200],
    image: image,
    actions: [{ action: "Detail", title: "View", icon: "https://rekrueger.github.io/archa.com/favicon.ico" }]
  };
  event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event) {
  console.log("[Service Worker] Notification click Received.", event.notification.data);
  
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
/*
self.addEventListener('push', function(event) {
  var message = JSON.parse(event.data.text()); //
  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
    })
  );
});
*/
// Any other custom service worker logic can go here.
