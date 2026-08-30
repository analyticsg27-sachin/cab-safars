// Firebase Messaging Service Worker — handles background push notifications.
// This file must stay at /firebase-messaging-sw.js (root of the origin).

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Config is injected at runtime by the client via a postMessage.
// Fallback: use self.__FIREBASE_CONFIG if set.
let messaging = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    if (messaging) return; // already initialised
    firebase.initializeApp(event.data.config);
    messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      const data = payload.data || {};
      const clickUrl = data.click_url || '/app/driver/home';

      self.registration.showNotification(title || 'Cab Safars', {
        body: body || 'New update available',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        data: { clickUrl },
        actions: [{ action: 'open', title: 'Open App' }],
      });
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.clickUrl) || '/app/driver/home';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
