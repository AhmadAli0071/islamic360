import admin from 'firebase-admin';

let fcmInitialized = false;

export function initFirebaseAdmin() {
  if (fcmInitialized) return true;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccount) {
    console.warn('FIREBASE_SERVICE_ACCOUNT not set — FCM sending disabled');
    return false;
  }

  try {
    const credentials = JSON.parse(serviceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
    fcmInitialized = true;
    console.log('Firebase Admin initialized for FCM');
    return true;
  } catch (err) {
    console.error('Firebase Admin init failed:', err.message);
    return false;
  }
}

export function getFirebaseMessaging() {
  if (!fcmInitialized) return null;
  return admin.messaging();
}
