import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  curriculum: [{ week: Number, topic: String, description: String }],
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
