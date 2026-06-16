import mongoose from 'mongoose';

const hadithSchema = new mongoose.Schema({
  dayOfYear: { type: Number, required: true, unique: true },
  arabic: { type: String, required: true },
  urdu: { type: String, required: true },
  english: { type: String, required: true },
  narrator: { type: String, required: true },
  source: { type: String, required: true },
  reference: { type: String, default: '' },
  explanation: { type: String, default: '' },
}, { timestamps: true });

hadithSchema.index({ dayOfYear: 1 });

export default mongoose.model('Hadith', hadithSchema);
