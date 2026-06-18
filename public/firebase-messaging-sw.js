importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB8H4XNnWBAi1DIoc9GieF2D85KdZMRihQ",
  authDomain: "islamic360-87d75.firebaseapp.com",
  projectId: "islamic360-87d75",
  storageBucket: "islamic360-87d75.firebasestorage.app",
  messagingSenderId: "616701463239",
  appId: "1:616701463239:web:c81fcbb523531d7f04cce2",
  measurementId: "G-1Y4NL9MP1G"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'Islamic360';
  const body = payload.notification?.body || payload.data?.body || '';
  const soundDuration = parseInt(payload.data?.soundDuration || '3');
  const tag = payload.data?.tag || 'firebase-push';

  self.clients.matchAll({ type: 'window' }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'PLAY_NOTIFICATION_SOUND', duration: soundDuration });
    });
  });

  return self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag,
    vibrate: soundDuration >= 10 ? [500, 200, 500, 200, 500, 200, 500, 200, 500] : [200, 100, 200],
    requireInteraction: true,
    data: { type: tag.includes('prayer') ? 'prayer' : tag.includes('wazifa') ? 'wazifa' : 'push', url: '/' },
  });
});
