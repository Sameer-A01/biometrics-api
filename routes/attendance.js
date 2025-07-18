import express from 'express';
import { getAllAttendance, logAttendance } from '../controllers/attendanceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import pollerAuth from '../middleware/pollerAuth.js';

const router = express.Router();

// 🔐 GET should still be protected by login token (admin login)
router.get('/', authMiddleware, getAllAttendance);

// 📤 POST is now accessible to polling script using poller secret
router.post('/', pollerAuth, logAttendance);

export default router;
