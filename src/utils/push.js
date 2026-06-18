import { playAlarm, playShortSound } from './sound.ts';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export async function registerPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push not supported');
    return;
  }

  try {
    const res = await fetch('/api/push/vapid-public-key');
    const { publicKey } = await res.json();
    if (!publicKey) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const registration = await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
    }

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        type: 'user',
      }),
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'PLAY_NOTIFICATION_SOUND') {
        const dur = Number(event.data.duration) || 3;
        if (dur >= 10) playAlarm(dur);
        else playShortSound(dur);
        if (event.data.fromNotif === 'prayer') {
          window.history.replaceState(null, '', '/?tab=prayer');
          window.dispatchEvent(new CustomEvent('notif-nav', { detail: 'prayer' }));
        } else if (event.data.fromNotif === 'wazifa') {
          window.history.replaceState(null, '', '/?tab=wazifa');
          window.dispatchEvent(new CustomEvent('notif-nav', { detail: 'wazifa' }));
        }
      }
    });

    console.log('Push subscription registered');
  } catch (err) {
    console.error('Push registration error:', err);
  }
}
