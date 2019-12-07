const express = require('express');
// connection to mongodb via mongoose
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 5000;

const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a pdf'));
        }

        cb(undefined, true);
    }
});

app.post('/upload', upload.single('upload'), async (req, res) => {
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// Middleware for parsing json to object
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`connected on port ${port}`)
});

const jwt = require('jsonwebtoken');

const myFunction = async() => {
    const token = jwt.sign( { _id: "abc12345" }, 'secretcode', {expiresIn: "1 seconds"});
    console.log(token);

    const data = jwt.verify(token, 'secretcode');
    console.log(data);
}

myFunction();

// const main = async () => {
//     // const task = await Task.findById('5dd9e14fdb714f2e70c247ba');
//     // await task.populate('owner').execPopulate();a
//     // console.log(task.owner);

//     const user = await User.findById('5dd9e0b05c72190c6c83392e');
//     await user.populate('user_tasks').execPopulate();
//     console.log(user.user_tasks);
// };

//main();