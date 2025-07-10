const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local';
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values but ensures unique non-null values
  },
  profilePicture: {
    type: String,
    default: null
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for full name if needed
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to check if user can login with password
userSchema.methods.canLoginWithPassword = function() {
  return this.authProvider === 'local' && this.password;
};

// Method to check if user is OAuth user
userSchema.methods.isOAuthUser = function() {
  return this.authProvider !== 'local';
};

// Pre-save middleware to ensure data consistency
userSchema.pre('save', function(next) {
  // If this is a Google user, ensure googleId is present
  if (this.authProvider === 'google' && !this.googleId) {
    return next(new Error('Google ID is required for Google authentication'));
  }
  
  // If this is a local user, ensure password is present
  if (this.authProvider === 'local' && !this.password) {
    return next(new Error('Password is required for local authentication'));
  }
  
  next();
});

module.exports = mongoose.model('User', userSchema);