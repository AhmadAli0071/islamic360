// Try loading Firebase for FCM background messages — non-fatal if CDN fails
try { importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js'); } catch(e) { console.warn('Firebase CDN unavailable, FCM disabled'); }

if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp({
      apiKey: "AIzaSyB8H4XNnWBAi1DIoc9GieF2D85KdZMRihQ",
      authDomain: "islamic360-87d75.firebaseapp.com",
      projectId: "islamic360-87d75",
      storageBucket: "islamic360-87d75.firebasestorage.app",
      messagingSenderId: "616701463239",
      appId: "1:616701463239:web:c81fcbb523531d7f04cce2",
      measurementId: "G-1Y4NL9MP1G"
    });
  } catch(e) { console.warn('Firebase init failed:', e); }
}

const CACHE_NAME = 'islamic360-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

let pollInterval = null;
let city = 'Karachi';
let country = 'Pakistan';
let notifiedPrayers = new Set();
let notifiedWazifa = false;
let shownManualNotifs = new Set();

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || new Response('Offline', { status: 503 })))
  );
});

function notifyClientsPlaySound(soundDuration) {
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    clients.forEach((client) => client.postMessage({ type: 'PLAY_NOTIFICATION_SOUND', duration: soundDuration || 3 }));
  });
}

function showNotif(title, options) {
  notifyClientsPlaySound(options.soundDuration || 3);
  return self.registration.showNotification(title, options);
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function getTodayKey() {
  return new Date().toDateString();
}

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

function checkPrayerNotifications(prayers) {
  const currentMinutes = getCurrentMinutes();
  const todayKey = getTodayKey();
  for (const prayer of prayers) {
    const prayerMinutes = timeToMinutes(prayer.time);
    const diff = currentMinutes - prayerMinutes;
    const key = `${prayer.prayer}-${todayKey}`;
    if (diff >= 0 && diff <= 2 && !notifiedPrayers.has(key)) {
      notifiedPrayers.add(key);
      const hadithText = prayer.hadith
        ? `${prayer.hadith.urdu}\n\n— ${prayer.hadith.narrator} (${prayer.hadith.source})`
        : '';
      showNotif(`🕌 ${prayer.prayer} ka waqt hogaya`, {
        body: hadithText || `${prayer.prayer} ki namaz ka waqt hai`,
        tag: `sw-${prayer.prayer}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [500, 200, 500, 200, 500, 200, 500, 200, 500],
        requireInteraction: true,
        soundDuration: 10,
        data: { type: 'prayer', prayer: prayer.prayer },
      });
    }
  }
}

function checkWazifaNotification(wazifa) {
  if (!wazifa || notifiedWazifa) return;
  const currentMinutes = getCurrentMinutes();
  if (currentMinutes >= 300 && currentMinutes <= 750) {
    notifiedWazifa = true;
    showNotif(`🤲 Aaj ka Wazifa: ${wazifa.title.ur}`, {
      body: `${wazifa.urdu}\n\nTadad: ${wazifa.count} martaba`,
      tag: 'sw-wazifa',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      soundDuration: 3,
      data: { type: 'wazifa' },
    });
  }
}

function checkManualNotifications(notifs) {
  for (const n of notifs) {
    if (shownManualNotifs.has(n._id)) continue;
    shownManualNotifs.add(n._id);
    showNotif(n.title, {
      body: n.body || '',
      tag: `sw-manual-${n._id}`,
      icon: n.icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      soundDuration: 3,
      data: { type: 'manual' },
    });
  }
}

async function pollNotifications() {
  const todayKey = getTodayKey();
  if (!poll._lastDate) poll._lastDate = todayKey;
  if (poll._lastDate !== todayKey) {
    notifiedPrayers = new Set();
    notifiedWazifa = false;
    poll._lastDate = todayKey;
  }
  const schedule = await fetchJSON(`/api/notifications/schedule?city=${city}&country=${country}`);
  if (schedule) {
    checkPrayerNotifications(schedule.prayers);
    checkWazifaNotification(schedule.wazifa);
  }
  const manual = await fetchJSON('/api/notifications/manual');
  if (manual && manual.length > 0) checkManualNotifications(manual);
}
poll._lastDate = null;

function startPolling(cityVal, countryVal) {
  city = cityVal || 'Karachi';
  country = countryVal || 'Pakistan';
  notifiedPrayers = new Set();
  notifiedWazifa = false;
  if (pollInterval) clearInterval(pollInterval);
  pollNotifications();
  pollInterval = setInterval(pollNotifications, 30000);
}

function stopPolling() {
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
}

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'START_NOTIFICATION_POLL') {
    startPolling(data.city, data.country);
  } else if (data.type === 'STOP_NOTIFICATION_POLL') {
    stopPolling();
  } else if (data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(data.title, {
      body: data.body || '',
      tag: data.tag || 'islamic360',
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data: { type: 'manual' },
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const notifData = event.notification.data || {};
  let url = notifData.url || '/';
  if (notifData.type === 'prayer') url = '/?tab=prayer';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Handle pushes from VAPID (web-push) AND Firebase Admin
// Firebase Admin sends { notification: {...}, data: {...} }
// VAPID sends { title, body, soundDuration, tag }
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const raw = event.data.json();

    // Normalize: support both Firebase format { notification, data } and VAPID format { title, body }
    const title = raw.notification?.title || raw.title || 'Islamic360';
    const body = raw.notification?.body || raw.body || '';
    const soundDuration = raw.data?.soundDuration || raw.soundDuration || 3;
    const tag = raw.data?.tag || raw.tag || 'push';

    notifyClientsPlaySound(Number(soundDuration));
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: raw.icon || '/favicon.ico',
        badge: raw.badge || '/favicon.ico',
        vibrate: Number(soundDuration) >= 10 ? [500, 200, 500, 200, 500, 200, 500, 200, 500] : [200, 100, 200],
        requireInteraction: raw.requireInteraction !== false,
        data: { url: raw.url || '/', type: tag.includes('prayer') ? 'prayer' : tag.includes('wazifa') ? 'wazifa' : 'push' },
        tag,
      })
    );
  } catch {
    // Silent fail
  }
});
