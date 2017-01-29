const expect = require('expect');
const request = require('supertest');
const {
  ObjectID
} = require('mongodb');
let {
  app
} = require('./../server');
let {
  Todo
} = require('./../models/todo');
let {
  todos,
  populateTodos,
  users,
  populateUsers
} = require('./seed/seed');
const {
  User
} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Create a new todo';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text
      })
      .expect(200)
      .expect((result) => {
        //expect(result.body).toNotExist();
        expect(result.body.todo.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({
            text
          }).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should not create empty todo', (done) => {

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

});

describe('GET /todos', () => {
  it('should get all the todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/id', () => {
  it('should return a doc with gived id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect((res.body.todo.text)).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should not return a doc of another user', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  //5884c1e283366e45d6e82da3
  it('should return 404 if doc not found', (done) => {
    let id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is not valid', (done) => {
    request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/id', () => {
  it('should remove a todo with given id', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect((res.body.todo._id)).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not remove a todo of another user', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((e) => done(e));
      });
  });


  it('should return 404 when todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 when id is not valid', (done) => {
    let hexId = '123abd';

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe('PATCH /todos/id', () => {
  it('should update the todo', (done) => {
    let newText = 'This is new text case 1';
    let body = {
      text: newText,
      completed: true
    };
    let hexId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completed and completedAt', (done) => {
    let body = {
      text: 'hi lala',
      completed: false
    };
    let hexId = todos[1]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completedAt).toNotExist();
        expect(res.body.todo.completed).toBe(false);
      })
      .end(done);
  });

  it('should not update todo of others', (done) => {
    let body = {
      text: 'dummy text',
      completed: true
    };

    let hexId = todos[0]._id;
    request(app)
      .patch(`/todos/${hexId.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(body)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          expect(todos.completedAt).toNotExist();
          expect(todos.completed).toNotExist;
          done();
        }).catch((e) => done(e));
      });
    //.end(done);
  });

  // it('should not update the todo created by other user', (done) => {
  //   var hexId = todos[0]._id.toHexString();
  //   var text = 'This should be the new text';
  //
  //   request(app)
  //     .patch(`/todos/${hexId}`)
  //     .set('x-auth', users[1].tokens[0].token)
  //     .send({
  //       completed: true,
  //       text
  //     })
  //     .expect(404)
  //     .end(done);
  // });

});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email)
      }).end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a new user with valid details', (done) => {
    let email = 'hello3@example.com';
    let password = 'thisIs!';
    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body.email).toBe(email);
        expect(res.body._id).toExist();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({
          email
        }).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation error', (done) => {
    let email = 'haha';
    let password = 'hehehe';
    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });

  it('should return error for existing email id', (done) => {
    let email = "hello1@example.com";
    let password = "lolololol";
    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login the user and return the token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User
          .findById(users[1]._id)
          .then((user) => {
            expect(user.tokens[1])
              .toInclude({
                access: 'auth',
                token: res.headers['x-auth']
              });
            done();
          })
          .catch((e) => done(e));
      });
  });

  it('should return 400 for invalid credentials', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + 'a'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User
          .findById(users[1]._id)
          .then((user) => {
            expect(user.tokens.length)
              .toBe(1)
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove the token while logging out', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User
          .findById(users[0]._id)
          .then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch((e) => done(e));
      })
  });
});
