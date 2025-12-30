const mongoose = require('mongoose');
const { Schema, model, models } = mongoose;

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    unique: true, 
    sparse: true,
    lowercase: true 
  },
  password: { 
    type: String,
    // Not required for OAuth users
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  avatar: {  // ADD THIS FIELD
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Check if model already exists to avoid OverwriteModelError
const User = models.User || model('User', userSchema);

module.exports = User;