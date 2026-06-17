import webpush from 'web-push';
import PushSubscription from '../models/PushSubscription.js';

webpush.setVapidDetails(
  process.env.VAPID_MAILTO || 'mailto:admin@islamic360.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

export async function sendPushToAll(title, body, tag, soundDuration = 3) {
  const subs = await PushSubscription.find().lean();
  const payload = JSON.stringify({
    title,
    body,
    tag,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    soundDuration,
    requireInteraction: true,
    vibrate: soundDuration >= 10 ? [500, 200, 500, 200, 500, 200, 500, 200, 500] : [200, 100, 200],
  });

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      }, payload).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await PushSubscription.deleteOne({ endpoint: sub.endpoint });
        }
      })
    )
  );

  return { sent: results.filter(r => r.status === 'fulfilled').length, total: subs.length };
}

export async function sendPushToAllWithHadith(prayerName, hadith) {
  const title = `🕌 ${prayerName} ka waqt hogaya`;
  const body = hadith
    ? `${hadith.urdu}\n\n— ${hadith.narrator} (${hadith.source})`
    : `${prayerName} ki namaz ka waqt hai`;
  return sendPushToAll(title, body, `push-${prayerName}`, 10);
}

export async function sendPushWazifa(wazifa) {
  const title = `🤲 Aaj ka Wazifa: ${wazifa.title.ur}`;
  const body = `${wazifa.urdu}\n\nTadad: ${wazifa.count} martaba`;
  return sendPushToAll(title, body, 'push-wazifa', 3);
}

export async function sendPushManual(title, body) {
  return sendPushToAll(title, body, `push-manual-${Date.now()}`, 3);
}
