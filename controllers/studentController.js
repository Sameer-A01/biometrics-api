import Student from '../models/studentModel.js';

// @desc    Add a new student
// @route   POST /api/students
// @access  Private
export const addStudent = async (req, res) => {
  try {
    const { name, rollNumber, biometricId, class: studentClass, phoneNumber } = req.body;

    // Validation
    if (!name || !rollNumber || !biometricId || !studentClass) {
      return res.status(400).json({ message: 'Name, roll number, biometric ID, and class are required' });
    }

    // Convert biometricId to number and validate
    const parsedBiometricId = Number(biometricId);
    if (isNaN(parsedBiometricId)) {
      return res.status(400).json({ message: 'Biometric ID must be a valid number' });
    }

    // Prevent duplicate biometricId
    const existing = await Student.findOne({ biometricId: parsedBiometricId });
    if (existing) {
      return res.status(409).json({ message: 'Biometric ID already assigned to another student' });
    }

    // Validate phoneNumber if provided
    if (phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    const student = await Student.create({
      name,
      rollNumber,
      biometricId: parsedBiometricId,
      class: studentClass,
      phoneNumber, // Optional field
    });

    res.status(201).json({ message: 'Student created successfully', student });
  } catch (err) {
    console.error('Error in addStudent:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNumber, biometricId, class: studentClass, phoneNumber } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validation
    if (name && !name.trim()) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }
    if (rollNumber && !rollNumber.trim()) {
      return res.status(400).json({ message: 'Roll number cannot be empty' });
    }
    if (biometricId !== undefined) {
      const parsedBiometricId = Number(biometricId);
      if (isNaN(parsedBiometricId)) {
        return res.status(400).json({ message: 'Biometric ID must be a valid number' });
      }
      if (parsedBiometricId !== student.biometricId) {
        const existing = await Student.findOne({ biometricId: parsedBiometricId });
        if (existing) {
          return res.status(409).json({ message: 'Biometric ID already assigned to another student' });
        }
        student.biometricId = parsedBiometricId;
      }
    }
    if (studentClass && !studentClass.trim()) {
      return res.status(400).json({ message: 'Class cannot be empty' });
    }
    if (phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Update fields
    student.name = name || student.name;
    student.rollNumber = rollNumber || student.rollNumber;
    student.class = studentClass || student.class;
    student.phoneNumber = phoneNumber !== undefined ? phoneNumber : student.phoneNumber;

    await student.save();
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Error in updateStudent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.status(200).json(students);
  } catch (err) {
    console.error('Error in getStudents:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await Student.deleteOne({ _id: id });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error in deleteStudent:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};