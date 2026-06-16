import { Router } from 'express';
import { getSchedule, getPrayerTimesForNotification } from '../controllers/notificationController.js';

const router = Router();

router.get('/schedule', getSchedule);

export default router;
