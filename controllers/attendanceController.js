import Attendance from '../models/attendanceModel.js';
import Student from '../models/studentModel.js';

// @desc    Log a new attendance record
// @route   POST /api/attendance
// @access  Private
export const logAttendance = async (req, res) => {
  try {
    const { biometricId, timestamp, device } = req.body;

    // Validation
    if (!biometricId || !timestamp) {
      return res.status(400).json({ message: 'Biometric ID and timestamp are required' });
    }

    // Find student by biometricId
    const student = await Student.findOne({ biometricId });
    if (!student) {
      return res.status(404).json({ message: `No student found for biometricId ${biometricId}` });
    }

    // Check for duplicate attendance
    const existingAttendance = await Attendance.findOne({
      student: student._id,
      time: { $gte: new Date(new Date(timestamp).getTime() - 1000), $lte: new Date(timestamp) },
    });

    if (existingAttendance) {
      return res.status(409).json({ message: 'Attendance already logged for this time' });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      student: student._id,
      time: new Date(timestamp),
      device: device || 'Unknown Device',
    });

    // Populate student data for response
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('student', 'name rollNumber class biometricId phoneNumber');

    res.status(201).json({ message: 'Attendance logged successfully', attendance: populatedAttendance });
  } catch (error) {
    console.error('Error logging attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .sort({ time: -1 })
      .populate('student', 'name rollNumber class biometricId phoneNumber');
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};