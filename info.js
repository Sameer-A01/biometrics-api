import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Student from './models/studentModel.js'; // adjust path if needed
import connectToMongoDB from './db/connectToMongoDB.js';

await connectToMongoDB();

await Student.insertMany([
  {
    name: 'Alice Sharma',
    rollNumber: '23CS101',
    deviceId: 1,
    class: '10-A',
  },
  {
    name: 'Rohan Kumar',
    rollNumber: '23CS102',
    deviceId: 2,
    class: '10-B',
  },
]);

console.log('✅ Test students inserted');
mongoose.disconnect();
