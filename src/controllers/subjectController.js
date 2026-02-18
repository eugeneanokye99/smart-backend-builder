const Subject = require('../models/subject');

// Create a new subject
exports.createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('teachers', 'firstName lastName email')
      .populate('courses', 'title code')
      .populate('prerequisites', 'name code');
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('teachers', 'firstName lastName email')
      .populate('courses', 'title code')
      .populate('prerequisites', 'name code');
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a subject
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('teachers', 'firstName lastName email')
      .populate('courses', 'title code')
      .populate('prerequisites', 'name code');
    
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const subject = await Subject.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add teacher to subject
exports.addTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id, 
      { $addToSet: { teachers: teacherId } },
      { new: true }
    ).populate('teachers', 'firstName lastName email');
    
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove teacher from subject
exports.removeTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id, 
      { $pull: { teachers: teacherId } },
      { new: true }
    ).populate('teachers', 'firstName lastName email');
    
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add course to subject
exports.addCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id, 
      { $addToSet: { courses: courseId } },
      { new: true }
    ).populate('courses', 'title code');
    
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove course from subject
exports.removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id, 
      { $pull: { courses: courseId } },
      { new: true }
    ).populate('courses', 'title code');
    
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Add prerequisite
exports.addPrerequisite = async (req, res) => {
  try {
    const { prerequisiteId } = req.body;
    
    if (req.params.id === prerequisiteId) {
        return res.status(400).json({ success: false, error: 'Subject cannot be a prerequisite of itself' });
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id, 
      { $addToSet: { prerequisites: prerequisiteId } },
      { new: true }
    ).populate('prerequisites', 'name code');
    
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remove prerequisite
exports.removePrerequisite = async (req, res) => {
  try {
    const { prerequisiteId } = req.params;
    const subject = await Subject.findByIdAndUpdate(
      req.params.id, 
      { $pull: { prerequisites: prerequisiteId } },
      { new: true }
    ).populate('prerequisites', 'name code');
    
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
