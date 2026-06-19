import { Router } from 'express';
import { createOrder, getOrdersByPhone, savePhoneSubscription } from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.post('/subscribe', savePhoneSubscription);
router.get('/track/:phone', getOrdersByPhone);

export default router;
