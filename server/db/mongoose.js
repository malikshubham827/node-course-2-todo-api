const mongoose = require('mongoose')

mongoose.Promise = Promise;
mongoose.connect('process.env.MONGODB_URI || mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
