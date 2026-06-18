interface ManualNotif {
  _id: string;
  title: string;
  body: string;
  icon: string;
  createdAt: string;
}

interface PrayerNotification {
  prayer: string;
  time: string;
  hadith: { arabic: string; urdu: string; english: string; narrator: string; source: string } | null;
}

interface WazifaNotification {
  title: { en: string; ur: string };
  arabic: string;
  urdu: string;
  english: string;
  count: number;
  type: string;
}

interface ScheduleData {
  date: string;
  hijri: { full: string; fullAr: string };
  prayers: PrayerNotification[];
  wazifa: WazifaNotification | null;
}

interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}

const API_BASE = '/api';
const NOTIFICATION_TAG = 'islamic360';

let notifiedPrayers = new Set<string>();
let notifiedWazifa = false;
let shownManualNotifs = new Set<string>();
let lastManualCheck = '';
let checkInterval: ReturnType<typeof setInterval> | null = null;

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function registerServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registered:', registration.scope);
    return true;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return false;
  }
}

let _swRegistration: ServiceWorkerRegistration | null = null;

export function subscribeToPush() {
  if (!_swRegistration || !('PushManager' in window)) return;

  const publicKeyBase64 = 'BCLFgW4MfGMHm8N3DxI5iwS6fwO3p0K5lPEmeqIbZic09OKoFsucVUj6ZombxjllyuBlXdMXvE8CpMYP04XS_XI';
  const publicKey = urlBase64ToUint8Array(publicKeyBase64);

  // Call subscribe() synchronously - preserves gesture context for Chrome mobile
  _swRegistration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: publicKey })
    .then(s => saveSubscription(s))
    .catch(e => console.error('Push sub failed:', e));
}

function saveSubscription(sub: PushSubscription) {
  fetch(`${API_BASE}/push/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: sub.endpoint,
      keys: { p256dh: arrayBufferToBase64(sub.getKey('p256dh')), auth: arrayBufferToBase64(sub.getKey('auth')) },
      userAgent: navigator.userAgent,
    }),
  }).then(() => console.log('Push subscription saved'))
    .catch(e => console.error('Push save failed:', e));
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function fetchSchedule(city = 'Karachi', country = 'Pakistan'): Promise<ScheduleData | null> {
  try {
    const res = await fetch(`${API_BASE}/notifications/schedule?city=${city}&country=${country}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('Failed to fetch schedule:', error);
    return null;
  }
}

export async function fetchManualNotifications(): Promise<ManualNotif[]> {
  try {
    const res = await fetch(`${API_BASE}/notifications/manual?since=${encodeURIComponent(lastManualCheck)}`);
    const json = await res.json();
    if (json.success && json.data.length > 0) {
      lastManualCheck = json.data[0].createdAt;
    }
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

function checkManualNotifications(notifs: ManualNotif[]) {
  for (const n of notifs) {
    if (shownManualNotifs.has(n._id)) continue;
    shownManualNotifs.add(n._id);
    showBrowserNotification(n.title, n.body, `${NOTIFICATION_TAG}-manual-${n._id}`, 3);
  }
}

let activeAudioCtx: AudioContext | null = null;
let activeOsc: OscillatorNode | null = null;
let activeGain: GainNode | null = null;

export function playNotificationSound(duration = 2) {
  try {
    if (activeAudioCtx) {
      activeOsc?.stop();
      activeAudioCtx.close();
    }

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);

    activeAudioCtx = ctx;
    activeOsc = osc;
    activeGain = gain;

    setTimeout(() => {
      if (activeAudioCtx === ctx) {
        activeAudioCtx = null;
        activeOsc = null;
        activeGain = null;
      }
    }, duration * 1000 + 100);

    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    // Silent fail
  }
}

function showBrowserNotification(title: string, body: string, tag: string, soundDuration = 2) {
  if (Notification.permission === 'granted') {
    playNotificationSound(soundDuration);
    const n = new Notification(title, {
      body,
      tag,
      icon: '/favicon.ico',
      requireInteraction: true,
    });
    (n as any).vibrate = soundDuration >= 10 ? [500, 200, 500, 200, 500, 200, 500, 200, 500] : [200, 100, 200];
  }
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function checkPrayerNotifications(prayers: PrayerNotification[], todayKey: string) {
  const currentMinutes = getCurrentMinutes();

  for (const prayer of prayers) {
    const prayerMinutes = timeToMinutes(prayer.time);
    const diff = currentMinutes - prayerMinutes;

    if (diff >= 0 && diff <= 2 && !notifiedPrayers.has(`${prayer.prayer}-${todayKey}`)) {
      notifiedPrayers.add(`${prayer.prayer}-${todayKey}`);

      const hadithText = prayer.hadith
        ? `${prayer.hadith.urdu}\n\n— ${prayer.hadith.narrator} (${prayer.hadith.source})`
        : '';

      showBrowserNotification(
        `🕌 ${prayer.prayer} ka waqt hogaya`,
        hadithText || `${prayer.prayer} ki namaz ka waqt hai`,
        `${NOTIFICATION_TAG}-${prayer.prayer}`,
        10,
      );
    }
  }
}

function checkWazifaNotification(wazifa: WazifaNotification | null, todayKey: string) {
  if (!wazifa || notifiedWazifa) return;

  const currentMinutes = getCurrentMinutes();
  const fajrTime = 5 * 60 + 0;
  const dhuhrTime = 12 * 60 + 30;

  if (currentMinutes >= fajrTime && currentMinutes <= dhuhrTime) {
    notifiedWazifa = true;
    showBrowserNotification(
      `🤲 Aaj ka Wazifa: ${wazifa.title.ur}`,
      `${wazifa.urdu}\n\nTadad: ${wazifa.count} martaba`,
      `${NOTIFICATION_TAG}-wazifa`,
      3,
    );
  }
}

export async function startNotificationSystem() {
  const granted = await requestNotificationPermission();
  if (!granted) {
    console.warn('Notification permission not granted');
    return;
  }

  await registerServiceWorker();

  const getCityFromStorage = () => {
    try {
      const stored = localStorage.getItem('theislamic360_city');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { city: parsed.name || 'Karachi', country: parsed.country || 'Pakistan' };
      }
    } catch {}
    return { city: 'Karachi', country: 'Pakistan' };
  };

  // Wait for SW to be ready BEFORE setting up gesture listener
  const reg = await navigator.serviceWorker.ready;
  _swRegistration = reg;

  // Tell service worker to start polling for background notifications
  const { city, country } = getCityFromStorage();
  const sendCityToSW = () => {
    reg.active?.postMessage({ type: 'START_NOTIFICATION_POLL', city, country });
  };
  setTimeout(sendCityToSW, 1000);

  // === FCM TOKEN (more reliable on mobile Chrome) ===
  try {
    const { getFCMToken, registerFCMToken, setupForegroundMessageHandler } = await import('./firebaseMessaging');
    setupForegroundMessageHandler();
    const fcmToken = await getFCMToken(reg);
    if (fcmToken) {
      registerFCMToken(fcmToken);
      console.log('FCM token obtained:', fcmToken.substring(0, 20) + '...');
    }
  } catch (e) {
    console.warn('FCM setup failed, falling back to VAPID:', e);
  }

  // === VAPID PUSH SUBSCRIBE (fallback for desktop) ===
  // Subscribe to push on first user gesture (required by Chrome mobile)
  const subscribeOnTouch = () => {
    subscribeToPush();
    document.removeEventListener('click', subscribeOnTouch);
    document.removeEventListener('touchstart', subscribeOnTouch);
  };
  document.addEventListener('click', subscribeOnTouch, { once: true });
  document.addEventListener('touchstart', subscribeOnTouch, { once: true });
  // Also try immediately (works on desktop)
  subscribeToPush();

  // Listen for PLAY_NOTIFICATION_SOUND from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'PLAY_NOTIFICATION_SOUND') {
      const duration = event.data.duration || 3;
      playNotificationSound(duration);
    }
  });

  const todayKey = new Date().toDateString();
  notifiedPrayers = new Set();
  notifiedWazifa = false;

  const fetchAndNotify = async () => {
    const { city, country } = getCityFromStorage();
    const schedule = await fetchSchedule(city, country);
    if (schedule) {
      checkPrayerNotifications(schedule.prayers, todayKey);
      checkWazifaNotification(schedule.wazifa, todayKey);
    }
    const manualNotifs = await fetchManualNotifications();
    checkManualNotifications(manualNotifs);
  };

  await fetchAndNotify();

  if (checkInterval) clearInterval(checkInterval);

  checkInterval = setInterval(fetchAndNotify, 30000);
}

export function stopNotificationSystem() {
  navigator.serviceWorker.controller?.postMessage({ type: 'STOP_NOTIFICATION_POLL' });
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  notifiedPrayers = new Set();
  notifiedWazifa = false;
}
