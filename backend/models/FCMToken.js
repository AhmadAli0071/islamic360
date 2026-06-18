import mongoose from 'mongoose';

const fcmTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userAgent: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('FCMToken', fcmTokenSchema);
