const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  login,
  updateStatus,
  addCourse,
  removeCourse,
  updateAddress,
  updateGuardian
} = require('../controllers/studentController');

// Standard CRUD routes
router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

// Authentication route
router.post('/login', login);

// Entity-specific operations
router.patch('/:id/status', updateStatus);

router.post('/:id/courses', addCourse);
router.delete('/:id/courses/:courseId', removeCourse);

router.put('/:id/address', updateAddress);
router.put('/:id/guardian', updateGuardian);

module.exports = router;
