const mongoose = require('mongoose');

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // New userId field to link a todo to a user
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the User model
    ref: 'User',  // The name of the User model
    required: true,  // Make sure each todo is associated with a user
  },
});

// Create and export the Todo model
module.exports = mongoose.model('Todo', todoSchema);
