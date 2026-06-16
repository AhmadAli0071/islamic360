import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  qualifications: [{ type: String }],
  specializations: [{ type: String }],
  experience: { type: String, required: true },
  bio: { type: String, default: '' },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Teacher', teacherSchema);
