const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
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
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['student'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'graduated'],
    default: 'active'
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please fill a valid phone number']
  },
  address: {
    street: {
      type: String,
      maxlength: 100,
      trim: true
    },
    city: {
      type: String,
      maxlength: 50,
      trim: true
    },
    state: {
      type: String,
      maxlength: 50,
      trim: true
    },
    zipCode: {
      type: String,
      maxlength: 10,
      trim: true
    },
    country: {
      type: String,
      maxlength: 50,
      trim: true
    }
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  guardian: {
    firstName: {
      type: String,
      maxlength: 50,
      trim: true
    },
    lastName: {
      type: String,
      maxlength: 50,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please fill a valid phone number']
    },
    relationship: {
      type: String,
      enum: ['parent', 'guardian', 'sponsor', 'other']
    }
  },
  profilePicture: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
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
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
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
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
