// CRUD

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) return console.log('There is an error');
    
    const db = client.db(databaseName);
    // db.collection('users').insertOne({
    //     name: 'Stevan',
    //     age: 26
    // }, (error, result) => {
    //     if(error) return console.log('Unable to insert user');

    //     console.log(result.ops);
    // });
    // db.collection('users').insertMany([
    //     {
    //         name: "Jen",
    //         age: 42
    //     },
    //     {   name: "Gunther",
    //         age: 24
    //     }], (error, result) => {
    //     if(error) return console.log('Unable to insert document');

    //     console.log(result.ops);
    // });
    // db.collection('tasks').insertMany([
    //     {
    //         description: "install windows 10",
    //         completed: false
    //     },
    //     {
    //         description: "continue learning nodejs",
    //         completed: true
    //     },
    //     {
    //         description: "eat dinner",
    //         completed: false
    //     }], (error, result) => {
    //         if(error) return console.log('unable to insert documents');

    //         console.log(result.ops);
    //     });

});