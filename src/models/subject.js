const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 20
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  department: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  level: {
    type: String,
    enum: ['primary', 'junior_secondary', 'senior_secondary', 'undergraduate', 'postgraduate'],
    required: true
  },
  creditHours: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  isElective: {
    type: Boolean,
    default: false
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
subjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
