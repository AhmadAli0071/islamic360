import webpush from 'web-push';
import PushSubscription from '../models/PushSubscription.js';
import FCMToken from '../models/FCMToken.js';
import { initFirebaseAdmin, getFirebaseMessaging } from '../config/firebaseAdmin.js';

let vapidInitialized = false;

const FALLBACK_VAPID = {
  publicKey: 'BCLFgW4MfGMHm8N3DxI5iwS6fwO3p0K5lPEmeqIbZic09OKoFsucVUj6ZombxjllyuBlXdMXvE8CpMYP04XS_XI',
  privateKey: '6o3JSBxkeTE--xaaY-Ksnp-sycGjIf5-qq_oJ2yZp7o',
  mailto: 'mailto:admin@islamic360.com',
};

function ensureVapid() {
  if (vapidInitialized) return;
  webpush.setVapidDetails(
    process.env.VAPID_MAILTO || FALLBACK_VAPID.mailto,
    process.env.VAPID_PUBLIC_KEY || FALLBACK_VAPID.publicKey,
    process.env.VAPID_PRIVATE_KEY || FALLBACK_VAPID.privateKey,
  );
  vapidInitialized = true;
}

function buildPayload(title, body, tag, soundDuration = 3) {
  return JSON.stringify({
    title,
    body,
    tag,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    soundDuration,
    requireInteraction: true,
    vibrate: soundDuration >= 10 ? [500, 200, 500, 200, 500, 200, 500, 200, 500] : [200, 100, 200],
  });
}

async function sendViaVAPID(title, body, tag, soundDuration = 3) {
  ensureVapid();
  const subs = await PushSubscription.find().lean();
  if (subs.length === 0) return { sent: 0, total: 0 };

  const payload = buildPayload(title, body, tag, soundDuration);

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

async function sendViaFCM(title, body, tag, soundDuration = 3) {
  const messaging = getFirebaseMessaging();
  if (!messaging) return { sent: 0, total: 0 };

  const tokens = await FCMToken.find().lean();
  if (tokens.length === 0) return { sent: 0, total: 0 };

  const message = {
    notification: { title, body },
    data: {
      tag,
      soundDuration: String(soundDuration),
    },
  };

  const results = await Promise.allSettled(
    tokens.map((t) =>
      messaging.send({ ...message, token: t.token }).catch(async (err) => {
        if (err.code === 'messaging/registration-token-not-registered') {
          await FCMToken.deleteOne({ token: t.token });
        }
      })
    )
  );

  return { sent: results.filter(r => r.status === 'fulfilled').length, total: tokens.length };
}

export async function sendPushToAll(title, body, tag, soundDuration = 3) {
  initFirebaseAdmin();
  const [vapidResult, fcmResult] = await Promise.all([
    sendViaVAPID(title, body, tag, soundDuration),
    sendViaFCM(title, body, tag, soundDuration),
  ]);
  return {
    vapid: vapidResult,
    fcm: fcmResult,
    sent: vapidResult.sent + fcmResult.sent,
    total: vapidResult.total + fcmResult.total,
  };
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
