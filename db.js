const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI
const dbURI = process.env.DB_URL;

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(dbURI);
    console.log('DATABASE CONNECTED');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit with error
  }
}

module.exports = connectDB;
