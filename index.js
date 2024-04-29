const express = require('express');
const connectDB = require('./db'); // Import the database connection module
const User = require('./models/userModel'); // Import the User model
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
require('dotenv').config();

// Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    // Start the server once the database is connected
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1); // Exit with error
  });

// Add a new user to the database
app.post('/api/users', async (req, res) => {
  const { firstName, lastName, email, jobTitle, gender } = req.body;

  try {
    const newUser = await User.create({ firstName, lastName, email, jobTitle, gender });
    res.status(201).json({ msg: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ msg: 'Failed to create user' });
  }
});

// Get all users from the database
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ msg: 'Failed to fetch users' });
  }
});

// Get a user by ID from the database
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ msg: 'Failed to fetch user' });
  }
});

// Update a user in the database
app.patch('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, jobTitle, gender } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { firstName, lastName, email, jobTitle, gender }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ msg: 'Failed to update user' });
  }
});

// Delete a user from the database
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json({ msg: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ msg: 'Failed to delete user' });
  }
});

module.exports = app; // Export the app for testing purposes or deployment
  