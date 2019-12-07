// CRUD

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) return console.log('There is an error');
    
    const db = client.db(databaseName);

    // db.collection('users').findOne( { _id: new ObjectID('5db6ff1ef1d13619149927e1')}, (error, res) => {
    //     if(error) return console.log('Unable to fetch user');

    //     console.log(res);
    // });

    // db.collection('users').find( { age: 26}).toArray((error, matches) => {
    //     console.log(matches);
    // });

    // db.collection('users').findOne({ _id: new ObjectID('5db6ff1ef1d13619149927e1') }, (error, result) => {
    //     console.log(result);
    // });

    // db.collection('tasks').find({ completed: false }).toArray((error, result) => {
    //     console.log(result);
    // });

    // db.collection('users').updateOne({ _id: new ObjectID('5db6fef36310fc1e58653e81')},
    // {
    //     $unset: {
    //         __id: ""
    //     }
    // }).then((result) => {
    //     console.log('res', result.modifiedCount);
    // }).catch((error) => {
    //     console.log(error);
    // });

//     db.collection('tasks').updateMany({completed: false}, {
//         $set: {
//             completed: true
//         }
//     }).then((result) => {
//         console.log(result.modifiedCount);
//     }).catch((err) => { console.log(err) });

// db.collection('users').deleteMany({ age: 23 }).then((result) => { console.log(result.deletedCount) }).catch((err) => {console.log(err)});
    db.collection('tasks').deleteOne({ description: "eat dinner" }).then((res) => console.log(res)).catch((err) => console.log(res));

});

// cd "Program Files/MongoDB/Server/4.2/bin/"
// mongod.exe --dbpath="X:\Program Files\MongoDB\Server\4.2\data\db"