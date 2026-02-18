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
