import { Router } from 'express';
import PushSubscription from '../models/PushSubscription.js';

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

export default router;
