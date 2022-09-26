const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Name is not be empty']
  },
  password: {
    type: String,
    required: [true, 'Password is not be empty']
  },
  role: {
    type: String,
    required: [true, 'Role is not be empty']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
