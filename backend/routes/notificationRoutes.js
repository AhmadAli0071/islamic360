import { Router } from 'express';
import { getSchedule, getPrayerTimesForNotification } from '../controllers/notificationController.js';
import { getManualNotifications } from '../controllers/adminController.js';

const router = Router();

router.get('/schedule', getSchedule);
router.get('/manual', getManualNotifications);

export default router;
