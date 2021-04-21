


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

  const { image, tag, url, title, text, body } = event.data.json();

  const options = {
    data: url,
    body: text,
    icon: image,
    vibrate: [200, 100, 200],
    tag: tag,
    image: image,
    //badge: "https://spyna.it/icons/favicon.ico",
    actions: [{ action: "Detail", title: "View" }]
  };
  event.waitUntil(self.registration.showNotification(title, {
    options
  }));
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

// Any other custom service worker logic can go here.
