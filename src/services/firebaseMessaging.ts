import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../config/firebase';
import { playNotificationSound } from './notificationManager';

const VAPID_KEY = 'BCLFgW4MfGMHm8N3DxI5iwS6fwO3p0K5lPEmeqIbZic09OKoFsucVUj6ZombxjllyuBlXdMXvE8CpMYP04XS_XI';

export async function getFCMToken(swRegistration?: ServiceWorkerRegistration): Promise<string | null> {
  try {
    // Use our SW so Firebase doesn't register its own (avoiding SW conflict)
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });
    return token;
  } catch (error) {
    console.warn('FCM token failed:', error);
    return null;
  }
}

export function registerFCMToken(token: string) {
  fetch(`/api/push/fcm-subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, userAgent: navigator.userAgent }),
  }).then(() => console.log('FCM token saved'))
    .catch(e => console.error('FCM token save failed:', e));
}

export function unregisterFCMToken(token: string) {
  fetch(`/api/push/fcm-unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }).catch(() => {});
}

export function setupForegroundMessageHandler() {
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || payload.data?.title || 'Islamic360';
    const body = payload.notification?.body || payload.data?.body || '';
    const soundDuration = parseInt(payload.data?.soundDuration || '3');

    if (Notification.permission === 'granted') {
      playNotificationSound(soundDuration);
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: soundDuration >= 10 ? [500, 200, 500, 200, 500, 200, 500, 200, 500] : [200, 100, 200],
        requireInteraction: true,
        tag: payload.data?.tag || 'firebase-push',
      });
    }
  });
}
