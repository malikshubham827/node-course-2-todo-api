const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Cannot connect to the MongoDB server');
  }
  console.log('Successfully connected to server');

  // deleteOne

  //deleteMany
  // db
  //   .collection('Users')
  //   .deleteMany({
  //     name: 'Siddhant Bagga'
  //   })
  //   .then((result) => {
  //     console.log(result);
  //   })

  //findOneAndDelete
  db
    .collection('Users')
    .findOneAndDelete({
      _id: new ObjectID("58802c261eb4d9147f30b346")
    })
    .then((result) => {
      console.log(result);
    })

})
