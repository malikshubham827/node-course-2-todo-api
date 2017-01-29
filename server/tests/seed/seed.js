const {
  ObjectID
} = require('mongodb');
const {
  Todo
} = require('./../../models/todo');
const jwt = require('jsonwebtoken');
const {
  User
} = require('./../../models/user');

let userOneId = new ObjectID();
let userTwoId = new ObjectID();

let todos = [{
  _id: new ObjectID(),
  text: 'First todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

let users = [{
  _id: userOneId,
  email: 'hello1@example.com',
  password: 'userOnePassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: userOneId,
      access: 'auth'
    }, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'hello2@example.com',
  password: 'userTwoPassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: userTwoId,
      access: 'auth'
    }, process.env.JWT_SECRET).toString()
  }]
}];

let populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

let populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
