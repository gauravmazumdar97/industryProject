const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  gender: { type: String },
  jobTitle: { type: String },
});

// Create User model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;