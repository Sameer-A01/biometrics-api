import express from 'express';
import { addStudent, getStudents, deleteStudent, updateStudent } from '../controllers/studentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addStudent); // Create student
router.get('/', authMiddleware, getStudents); // List all students
router.put('/:id', authMiddleware, updateStudent); // Update a student
router.delete('/:id', authMiddleware, deleteStudent); // Delete a student

export default router;