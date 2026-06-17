import { Router } from 'express';
import { getCourses, getCourseBySlug } from '../controllers/courseController.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

router.get('/', cacheMiddleware(300), getCourses);
router.get('/:slug', cacheMiddleware(300), getCourseBySlug);

export default router;
