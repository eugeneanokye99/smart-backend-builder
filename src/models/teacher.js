const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['teacher', 'head_teacher', 'assistant_teacher'],
    default: 'teacher'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  subjects: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please fill a valid phone number']
  },
  profilePicture: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: { type: String, maxlength: 100 },
    city: { type: String, maxlength: 50 },
    state: { type: String, maxlength: 50 },
    zipCode: { type: String, maxlength: 10 }
  },
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
teacherSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
