self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const soundDuration = data.soundDuration || 3;
  const vibratePattern = Number(soundDuration) >= 10
    ? Array(Number(soundDuration) * 2).fill(0).map((_, i) => i % 2 === 0 ? 500 : 200)
    : [200, 100, 200];

  const notifType = data.tag?.includes('prayer') ? 'prayer' : data.tag?.includes('wazifa') ? 'wazifa' : 'push';

  event.waitUntil(
    self.registration.showNotification(data.title || 'Islamic360', {
      body: data.body || '',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: vibratePattern,
      requireInteraction: true,
      data: {
        url: data.url || '/',
        type: notifType,
        tag: data.tag,
        soundDuration: Number(soundDuration),
      },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const notifData = event.notification.data || {};
  const notifType = notifData.type || 'push';
  const soundDuration = notifData.soundDuration || 3;
  let url = notifData.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({ type: 'PLAY_NOTIFICATION_SOUND', duration: soundDuration, fromNotif: notifType });
          client.navigate(url);
          return;
        }
      }
      clients.openWindow(url + (url.includes('?') ? '&' : '?') + `from_notif=${notifType}`);
    })
  );
});
