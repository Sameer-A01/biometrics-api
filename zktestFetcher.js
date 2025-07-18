import mongoose from 'mongoose';
import Attendance from './models/attendanceModel.js';
import Student from './models/studentModel.js';
import connectToMongoDB from './db/connectToMongoDB.js';

// Start with DB connection
await connectToMongoDB();

// ⚠️ MOCK attendance logs (simulate biometric device logs)
const mockLogs = {
  data: [
    { biometricId: 1, timestamp: new Date() },
    { biometricId: 2, timestamp: new Date() },
  ],
};

(async () => {
  try {
    for (const log of mockLogs.data) {
      const { biometricId, timestamp } = log;

      const student = await Student.findOne({ biometricId });
      if (student) {
        await Attendance.create({
          student: student._id,
          time: timestamp,
          device: 'X2008 (Simulated)',
        });
        console.log(`✅ Attendance saved for ${student.name} at ${timestamp}`);
      } else {
        console.log(`❌ No student found for biometricId ${biometricId}`);
      }
    }

    console.log('🎉 Mock attendance sync complete.');
  } catch (error) {
    console.error('🚨 Error saving mock attendance:', error);
  }
})();

// 🛠️ For real biometric device integration, replace mockLogs with:
// const zk = new ZKLib('192.168.0.210', 4370, 10000, 4000);
// await zk.createSocket();
// const logs = await zk.getAttendances();