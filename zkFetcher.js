import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import ZKLib from 'node-zklib';
import Attendance from './models/attendanceModel.js';
import Student from './models/studentModel.js';


const pollBiometricDevice = async () => {


  const zk = new ZKLib(process.env.DEVICE_IP || '192.168.0.210', 4370, 10000);

  try {
    await zk.createSocket();
    console.log('📡 Connected to biometric device');

    const logs = await zk.getAttendances();
    const entries = logs.data;

    for (const log of entries) {
      const biometricId = log.userId;
      const timestamp = new Date(log.timestamp);

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
          // Duplicate key error
          console.log(`⚠️ Skipped duplicate for ${student.name} at ${timestamp}`);
        } else {
          console.error(`🚨 Error logging for ${student.name}:`, err.message);
        }
      }
    }

    console.log(`📊 Finished syncing. Total logs received: ${entries.length}`);
    await zk.disconnect();
    console.log('🔌 Disconnected from biometric device');
  } catch (error) {
    console.error('🚨 Error during polling:', error.message);
  }
};

export default pollBiometricDevice;
