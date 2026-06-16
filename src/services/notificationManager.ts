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

const API_BASE = '/api';
const NOTIFICATION_TAG = 'islamic360';

let notifiedPrayers = new Set<string>();
let notifiedWazifa = false;
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

function showBrowserNotification(title: string, body: string, tag: string) {
  if (Notification.permission === 'granted') {
    const n = new Notification(title, {
      body,
      tag,
      icon: '/favicon.ico',
      requireInteraction: true,
    });
    (n as any).vibrate = [200, 100, 200];
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
        `${NOTIFICATION_TAG}-${prayer.prayer}`
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
      `${NOTIFICATION_TAG}-wazifa`
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
  const todayKey = new Date().toDateString();
  notifiedPrayers = new Set();
  notifiedWazifa = false;

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

  const fetchAndNotify = async () => {
    const { city, country } = getCityFromStorage();
    const schedule = await fetchSchedule(city, country);
    if (schedule) {
      checkPrayerNotifications(schedule.prayers, todayKey);
      checkWazifaNotification(schedule.wazifa, todayKey);
    }
  };

  await fetchAndNotify();

  if (checkInterval) clearInterval(checkInterval);

  checkInterval = setInterval(fetchAndNotify, 30000);
}

export function stopNotificationSystem() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  notifiedPrayers = new Set();
  notifiedWazifa = false;
}
