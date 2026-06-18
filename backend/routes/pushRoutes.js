import { Router } from 'express';
import PushSubscription from '../models/PushSubscription.js';
import FCMToken from '../models/FCMToken.js';

const router = Router();

router.post('/subscribe', async (req, res, next) => {
  try {
    const { endpoint, keys, userAgent } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ success: false, message: 'Invalid subscription' });
    }
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { endpoint, keys, userAgent: userAgent || '' },
      { upsert: true, new: true },
    );
    res.json({ success: true, message: 'Subscribed' });
  } catch (error) {
    next(error);
  }
});

router.post('/unsubscribe', async (req, res, next) => {
  try {
    const { endpoint } = req.body;
    if (endpoint) await PushSubscription.deleteOne({ endpoint });
    res.json({ success: true, message: 'Unsubscribed' });
  } catch (error) {
    next(error);
  }
});

router.post('/fcm-subscribe', async (req, res, next) => {
  try {
    const { token, userAgent } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Invalid FCM token' });
    }
    await FCMToken.findOneAndUpdate(
      { token },
      { token, userAgent: userAgent || '' },
      { upsert: true, new: true },
    );
    res.json({ success: true, message: 'FCM token registered' });
  } catch (error) {
    next(error);
  }
});

router.post('/fcm-unsubscribe', async (req, res, next) => {
  try {
    const { token } = req.body;
    if (token) await FCMToken.deleteOne({ token });
    res.json({ success: true, message: 'FCM token removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
