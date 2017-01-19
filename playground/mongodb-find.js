const {
  MongoClient,
  ObjectID
} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB');
  }
  console.log('Successfully connected to MongoDB');

  db
    .collection('Users')
    .find({
      name: 'Shubham Malik'
    })
    //.find()
    .toArray()
    .then((docs) => {
      console.log('Users:');
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('Cannot fetch Users', err);
    });

  db.close();
})
