import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const statusEntrySchema = new mongoose.Schema({
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], required: true },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: { type: [orderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  statusHistory: { type: [statusEntrySchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
