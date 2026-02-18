const express = require('express');
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateStatus,
  addStudent,
  removeStudent
} = require('../controllers/courseController');

// Standard CRUD routes
router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

// Entity-specific operations
router.patch('/:id/status', updateStatus);

router.post('/:id/students', addStudent);
router.delete('/:id/students/:studentId', removeStudent);

module.exports = router;
