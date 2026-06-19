import Order from '../models/Order.js';
import PushSubscription from '../models/PushSubscription.js';
import { sendPush } from '../services/push.js';

export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create({
      ...req.body,
      statusHistory: [{ status: 'pending', comment: 'Order placed successfully', createdAt: new Date() }],
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByPhone = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerPhone: req.params.phone })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image price')
      .lean();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) { res.status(404); throw new Error('Order not found'); }

    order.status = status;
    order.statusHistory.push({ status, comment: comment || '', createdAt: new Date() });
    await order.save();

    // Send push notification to subscribers with this phone
    const subs = await PushSubscription.find({ phone: order.customerPhone }).lean();
    const title = `📦 Order #${order._id.toString().slice(-6)} ${status}`;
    const body = comment || `Your order is now ${status}`;
    for (const sub of subs) {
      sendPush(sub.subscription, title, body, { tag: `order-${order._id}`, soundDuration: 3 }).catch(() => {});
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const savePhoneSubscription = async (req, res, next) => {
  try {
    const { subscription, phone } = req.body;
    if (!subscription || !phone) { res.status(400); throw new Error('Subscription and phone required'); }

    // Upsert: update if endpoint exists, otherwise create
    const existing = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    if (existing) {
      existing.phone = phone;
      await existing.save();
    } else {
      await PushSubscription.create({
        type: 'customer',
        endpoint: subscription.endpoint,
        keys: subscription.keys || {},
        subscription,
        phone,
      });
    }

    res.json({ success: true, message: 'Subscription saved with phone' });
  } catch (error) {
    next(error);
  }
};
