import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  course: { type: String, required: true },
  preferredSlot: { type: String, default: 'Weekend Morning' },
  status: { type: String, enum: ['pending', 'contacted', 'enrolled', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
