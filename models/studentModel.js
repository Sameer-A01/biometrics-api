import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  biometricId: { type: Number, required: true, unique: true }, // Renamed from deviceId, must match fingerprint ID
  class: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: false, // Set to false if optional
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'], // E.164 format (e.g., +919876543210)
  },
});

export default mongoose.model('Student', studentSchema);
