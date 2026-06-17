import { Router } from 'express';
import { createEnrollment } from '../controllers/enrollController.js';

const router = Router();

router.post('/', createEnrollment);

export default router;
