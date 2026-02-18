const Course = require('../models/course');
const Student = require('../models/student');
const Teacher = require('../models/teacher');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'firstName lastName email')
      .populate('assistants', 'firstName lastName email')
      .populate('students', 'firstName lastName studentId')
      .populate('prerequisites', 'title code');
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email')
      .populate('assistants', 'firstName lastName email')
      .populate('students', 'firstName lastName studentId')
      .populate('prerequisites', 'title code');
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('instructor', 'firstName lastName email')
      .populate('assistants', 'firstName lastName email')
      .populate('students', 'firstName lastName studentId')
      .populate('prerequisites', 'title code');
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    // Remove course from all enrolled students
    await Student.updateMany(
      { courses: req.params.id },
      { $pull: { courses: req.params.id } }
    );

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const course = await Course.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add student to course
exports.addStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Check capacity
    if (course.enrolledCount >= course.capacity) {
      return res.status(400).json({ success: false, error: 'Course is full' });
    }

    // Check if student is already enrolled
    if (course.students.includes(studentId)) {
      return res.status(400).json({ success: false, error: 'Student already enrolled' });
    }

    course.students.push(studentId);
    course.enrolledCount = course.students.length;
    await course.save();

    // Add course to student's courses
    student.courses.addToSet(course._id);
    await student.save();

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove student from course
exports.removeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const studentIndex = course.students.indexOf(studentId);
    if (studentIndex === -1) {
      return res.status(404).json({ success: false, error: 'Student not found in this course' });
    }

    course.students.splice(studentIndex, 1);
    course.enrolledCount = course.students.length;
    await course.save();

    // Remove course from student's courses
    await Student.findByIdAndUpdate(studentId, {
        $pull: { courses: course._id }
    });

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add assistant
exports.addAssistant = async (req, res) => {
  try {
    const { teacherId } = req.body;
    
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { assistants: teacherId } },
      { new: true }
    ).populate('assistants', 'firstName lastName email');

     if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove assistant
exports.removeAssistant = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $pull: { assistants: teacherId } },
      { new: true }
    ).populate('assistants', 'firstName lastName email');

     if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add prerequisite
exports.addPrerequisite = async (req, res) => {
  try {
    const { prerequisiteId } = req.body;
    
    if (req.params.id === prerequisiteId) {
        return res.status(400).json({ success: false, error: 'Course cannot be a prerequisite of itself' });
    }

    const prerequisite = await Course.findById(prerequisiteId);
    if (!prerequisite) {
        return res.status(404).json({ success: false, error: 'Prerequisite course not found' });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { prerequisites: prerequisiteId } },
      { new: true }
    ).populate('prerequisites', 'title code');

     if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove prerequisite
exports.removePrerequisite = async (req, res) => {
  try {
    const { prerequisiteId } = req.params;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $pull: { prerequisites: prerequisiteId } },
      { new: true }
    ).populate('prerequisites', 'title code');

     if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
