// routes/biometric.js
import express from 'express';
import { handleAttendancePush } from '../controllers/biometricController.js';

const router = express.Router();
router.post('/poller', handleAttendancePush);

export default router;
