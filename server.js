import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

import authRouter from "./routes/auth.js";

import userRouter from './routes/user.js';

// import dashboardRouter from './routes/dashboard.js';
import connectToMongoDB from "./db/connectToMongoDB.js";
import attendanceRouter from './routes/attendance.js';
import studentRouter from './routes/student.js';
import pollBiometricDevice from './zkFetcher.js'; // ✅ import polling function



const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(express.json());


// app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);

app.use('/api/attendance', attendanceRouter);
app.use('/api/students', studentRouter);
app.get('/', (req, res) => {
  res.send('✅ Biometric Attendance API is running.');
});

// ✅ Start the server and begin polling
// app.listen(process.env.PORT, () => {
//   connectToMongoDB();
//   console.log(`🚀 Server Running on port ${process.env.PORT}`);

//   // Start zkFetcher polling (with mock logs for now)
//   import('./zkFetcher.js'); // First immediate call

//   setInterval(() => {
//     import('./zkFetcher.js');
//   }, 30000); // Every 30 seconds
// });

// ✅ Start server and polling
app.listen(process.env.PORT, () => {
  connectToMongoDB();
  console.log(`🚀 Server Running on port ${process.env.PORT}`);

  // Immediately call the function
  pollBiometricDevice();

  // Then repeat every 30 seconds
  setInterval(() => {
    pollBiometricDevice();
  }, 30 * 1000); // 30 seconds
});