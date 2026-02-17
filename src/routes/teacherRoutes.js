const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  login,
  updateStatus,
  addSubject,
  removeSubject,
  addClass,
  removeClass
} = require('../controllers/teacherController');

// Standard CRUD routes
router.post('/', createTeacher);
router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

// Authentication route
router.post('/login', login);

// Entity-specific operations
router.patch('/:id/status', updateStatus);

router.post('/:id/subjects', addSubject);
router.delete('/:id/subjects/:subject', removeSubject);

router.post('/:id/classes', addClass);
router.delete('/:id/classes/:classId', removeClass);

module.exports = router;
