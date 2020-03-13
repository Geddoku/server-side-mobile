const mongoose = require('mongoose');

const user = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  courses: [String]
});

module.exports = mongoose.model('User', user);
