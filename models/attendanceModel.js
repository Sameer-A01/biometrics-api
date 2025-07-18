import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  time: Date,
  device: String,
});

// ✅ Add a compound index to prevent duplicates
attendanceSchema.index({ student: 1, time: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
