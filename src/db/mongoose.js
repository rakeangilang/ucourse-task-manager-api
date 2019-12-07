const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    // this one's set to false to prevent any deprecation warning msgs
    useFindAndModify: false
});