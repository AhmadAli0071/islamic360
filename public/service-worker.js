const CACHE_NAME = 'islamic360-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

  // Fetch: network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // API requests — network only (don't cache)
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Ad network requests — don't intercept (let them load directly)
  if (event.request.url.includes('effectivecpmnetwork.com') || event.request.url.includes('adsterra.com') || event.request.url.includes('popcash.net')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, cloned);
        });
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || new Response('Offline', { status: 503 })))
  );
});

// Notification handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, icon } = event.data;
    self.registration.showNotification(title, {
      body,
      tag,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      requireInteraction: true,
    });
  }
});

// Notification click: focus or open app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Handle push events from ad networks (Adsterra / PropellerAds)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title = data.title || 'Islamic360';
    const options = {
      body: data.body || '',
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data: { url: data.url || '/', network: data.network || 'adsterra' },
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    // Silent fail
  }
});
