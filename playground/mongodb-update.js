const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Cannot connect to the MongoDB server');
  }
  console.log('Successfully connected to the MongoDB server');

  db
    .collection('Users')
    .findOneAndUpdate({
      _id: new ObjectID('58802bede78b12147693de19')
    }, {
      $set: {
        location: 'Dwarka'
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    })
    .then((docs) => {
      console.log(docs);
    });
})
