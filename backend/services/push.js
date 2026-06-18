import webpush from 'web-push';
import PushSubscription from '../models/PushSubscription.js';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  process.env.VAPID_MAILTO || 'mailto:admin@islamic360.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
);

export function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY;
}

export async function sendPush(subscription, title, body, data = {}) {
  try {
    const payload = JSON.stringify({ title, body, ...data });
    await webpush.sendNotification(subscription, payload);
    return true;
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      if (subscription?.endpoint) {
        await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
      }
    }
    return false;
  }
}

export async function sendPushToAll(title, body, tag, soundDuration = 3) {
  const subs = await PushSubscription.find().lean();
  if (subs.length === 0) return { sent: 0, total: 0 };

  const results = await Promise.allSettled(
    subs.map((sub) => sendPush(sub.subscription, title, body, { tag, soundDuration }))
  );

  return { sent: results.filter(r => r.status === 'fulfilled' && r.value).length, total: subs.length };
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
