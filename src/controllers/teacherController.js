const Teacher = require('../models/teacher');

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json({ success: true, count: teachers.length, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a teacher
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
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

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // In a real application, you would generate and return a JWT here
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add subject
exports.addSubject = async (req, res) => {
  try {
    const { subject } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id, 
      { $addToSet: { subjects: subject } },
      { new: true }
    );
     if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove subject
exports.removeSubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id, 
      { $pull: { subjects: subject } },
      { new: true }
    );
     if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add class
exports.addClass = async (req, res) => {
   try {
    const { classId } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id, 
      { $addToSet: { classes: classId } },
      { new: true }
    );
     if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove class
exports.removeClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id, 
      { $pull: { classes: classId } },
      { new: true }
    );
     if (!teacher) {
      return res.status(404).json({ success: false, error: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
