import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

import authRouter from "./routes/auth.js";
import userRouter from './routes/user.js';
import connectToMongoDB from "./db/connectToMongoDB.js";
import attendanceRouter from './routes/attendance.js';
import studentRouter from './routes/student.js';
import biometricRouter from './routes/biometric.js';

import { handleAttendancePush } from './controllers/biometricController.js';

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

/** 👇 Biometric device will send logs to '/' via IP mode */
app.post('/', handleAttendancePush);

/** 👇 REST API routes */
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/students', studentRouter);
app.use('/api/biometric', biometricRouter);

/** 👇 For browser test */
app.get('/', (req, res) => {
  res.send('✅ Biometric Attendance API is running.');
});

/** 🚀 Start server */
app.listen(process.env.PORT, () => {
  connectToMongoDB();
  console.log(`🚀 Server Running on port ${process.env.PORT}`);
});
