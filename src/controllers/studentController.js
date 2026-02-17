const Student = require('../models/student');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    // Exclude password from response
    const studentObj = student.toObject();
    delete studentObj.password;
    res.status(201).json({ success: true, data: studentObj });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('class')
      .populate('courses');
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('class')
      .populate('courses');
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    // Prevent password update through this route
    if (req.body.password) {
      delete req.body.password;
    }
    
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('class').populate('courses');
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Explicitly select password as it's deselected by default
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    student.lastLogin = Date.now();
    await student.save();

    // In a real application, you would generate and return a JWT here
    const studentObj = student.toObject();
    delete studentObj.password;
    
    res.status(200).json({ success: true, message: 'Login successful', data: studentObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add course
exports.addCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      { $addToSet: { courses: courseId } },
      { new: true }
    ).populate('courses');
     if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove course
exports.removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      { $pull: { courses: courseId } },
      { new: true }
    ).populate('courses');
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { address: req.body },
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update guardian
exports.updateGuardian = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { guardian: req.body },
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
