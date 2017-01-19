const {
  mongoose
} = require('./../server/db/mongoose');
const {
  User
} = require('./../server/models/user');

let id = '5880b31e359bc2296d111dc8';

User.findById(id).then((user) => {
  if (!user) {
    return console.log('user not found');
  }

  console.log('user', user);
}).catch((e) => console.log(e));
