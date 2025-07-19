// controllers/biometricController.js
import Attendance from '../models/attendanceModel.js';
import Student from '../models/studentModel.js';

export const handleAttendancePush = async (req, res) => {
  try {
    const logs = Array.isArray(req.body) ? req.body : [req.body];

    for (const log of logs) {
      const biometricId = log.UserID || log.userId;
      const timestamp = new Date(log.Timestamp || log.timestamp);

      const student = await Student.findOne({ biometricId });

      if (!student) {
        console.log(`❌ No student found for biometricId ${biometricId}`);
        continue;
      }

      try {
        await Attendance.create({
          student: student._id,
          time: timestamp,
          device: 'X2008',
        });

        console.log(`✅ Attendance logged for ${student.name} at ${timestamp}`);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`⚠️ Skipped duplicate for ${student.name} at ${timestamp}`);
        } else {
          console.error(`🚨 Error logging for ${student.name}:`, err.message);
        }
      }
    }

    res.status(200).json({ message: 'Logs processed' });
  } catch (err) {
    console.error('❌ Error processing logs:', err.message);
    res.status(500).json({ error: 'Failed to process logs' });
  }
};
