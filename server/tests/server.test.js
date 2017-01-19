const expect = require('expect');
const request = require('supertest');

let {
  app
} = require('./../server');
let {
  Todo
} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done())
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

        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  })

});
