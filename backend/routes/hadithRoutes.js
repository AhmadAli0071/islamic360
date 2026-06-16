import { Router } from 'express';
import { getDailyHadith, getRandomHadith, getHadithByPrayer } from '../controllers/hadithController.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

router.get('/daily', cacheMiddleware(86400), getDailyHadith);
router.get('/random', cacheMiddleware(3600), getRandomHadith);
router.get('/by-prayer', cacheMiddleware(3600), getHadithByPrayer);

export default router;
