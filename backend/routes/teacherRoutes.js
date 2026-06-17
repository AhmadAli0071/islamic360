import { Router } from 'express';
import { getTeachers } from '../controllers/teacherController.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

router.get('/', cacheMiddleware(300), getTeachers);

export default router;
