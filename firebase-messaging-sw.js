// Service Worker for Firebase Cloud Messaging — handles push notifications
// when the app is in the background or fully closed.
// IMPORTANT: this file MUST live at the site root (e.g. /firebase-messaging-sw.js).

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyBP0lw2WYMj7RQ42qsAlqpg8sE5Hu9k_0c",
  authDomain:        "koreanmadie.firebaseapp.com",
  projectId:         "koreanmadie",
  storageBucket:     "koreanmadie.firebasestorage.app",
  messagingSenderId: "226267487940",
  appId:             "1:226267487940:web:411e04e968e94cabe9b391"
});

const messaging = firebase.messaging();

// Background message handler — fires when site is closed or in another tab.
// The Cloud Function sends a `notification` payload, so the browser usually
// auto-renders the banner. We override here to set our own icon + click action.
messaging.onBackgroundMessage(payload => {
  const title = (payload.notification && payload.notification.title) || 'Korean with Madie';
  const body  = (payload.notification && payload.notification.body)  || '';
  const data  = payload.data || {};
  const options = {
    body,
    icon: '/assets/logo-app.png',
    badge: '/assets/logo-app.png',
    tag: data.chatId ? `chat-${data.chatId}` : undefined,
    renotify: true,
    data
  };
  return self.registration.showNotification(title, options);
});

// Click handler — focus existing tab or open the site, jump to chat if possible
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const data = event.notification.data || {};
  const targetUrl = '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) {
          c.postMessage({ kind: 'fcm-notification-click', data });
          return c.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
