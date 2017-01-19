 const MongoClient = require('mongodb').MongoClient;
 const argv = require('yargs')
   .usage('Usage: $0 --name[String] --age[Number] --location[String]')
   .demandOption(['name', 'age', 'location'])
   .argv;

 MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
   if (err) {
     return console.log('Unable to process the data');
   }

   console.log('Successfully communicated with the database');
   db.collection('Users').insertOne({
     name: argv.name,
     age: argv.age,
     location: argv.location
   }, (err, result) => {
     if (err) {
       return console.log('Unable to insert user', err);
     }
     console.log(JSON.stringify(result.ops, undefined, 2));
   });

   db.close();
 });
