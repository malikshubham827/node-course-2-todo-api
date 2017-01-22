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

let todos = [{
  _id: new ObjectID(),
  text: 'First todo'
}, {
  _id: new ObjectID(),
  text: 'Second todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Create a new todo';
    request(app)
      .post('/todos')
      .send({
        text
      })
      .expect(200)
      .expect((result) => {
        expect(result.body.text).toBe(text);
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/id', () => {
  it('should return a doc with gived id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect((res.body.todo.text)).toBe(todos[0].text)
      })
      .end(done);
  });

  //5884c1e283366e45d6e82da3
  it('should return 404 if doc not found', (done) => {
    let id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is not valid', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });

});
