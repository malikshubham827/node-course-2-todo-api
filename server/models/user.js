const mongoose = require('mongoose');

let User = mongoose.model('User', {
  email: {
    type: String,
    minlength: 1,
    trim: true,
    require: true
  }
});

module.exports = {
  User
};
