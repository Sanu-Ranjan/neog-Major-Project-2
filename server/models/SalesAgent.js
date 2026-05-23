const mongoose = require('mongoose');

const salesAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sales Agent name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Sales Agent email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SalesAgent', salesAgentSchema);
