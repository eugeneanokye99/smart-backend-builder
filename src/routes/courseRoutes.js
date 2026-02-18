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
  removeStudent,
  addAssistant,
  removeAssistant,
  addPrerequisite,
  removePrerequisite
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

router.post('/:id/assistants', addAssistant);
router.delete('/:id/assistants/:teacherId', removeAssistant);

router.post('/:id/prerequisites', addPrerequisite);
router.delete('/:id/prerequisites/:prerequisiteId', removePrerequisite);

module.exports = router;
