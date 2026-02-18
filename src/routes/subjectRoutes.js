const express = require('express');
const router = express.Router();
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  updateStatus,
  addTeacher,
  removeTeacher,
  addCourse,
  removeCourse,
  addPrerequisite,
  removePrerequisite
} = require('../controllers/subjectController');

// Standard CRUD routes
router.post('/', createSubject);
router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

// Entity-specific operations
router.patch('/:id/status', updateStatus);

router.post('/:id/teachers', addTeacher);
router.delete('/:id/teachers/:teacherId', removeTeacher);

router.post('/:id/courses', addCourse);
router.delete('/:id/courses/:courseId', removeCourse);

router.post('/:id/prerequisites', addPrerequisite);
router.delete('/:id/prerequisites/:prerequisiteId', removePrerequisite);

module.exports = router;
