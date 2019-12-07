const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const sharp = require('sharp');
const User = require('../models/user');
const multer = require('multer');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');

router.post('/users', async (req, res) => {
    const newUser = new User(req.body);

    try {
        const user = await newUser.save();
        sendWelcomeEmail(req.body.email, req.body.name);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }

    // newUser.save().then(() => {
    //     res.status(201).send(newUser);
    // }).catch((err) => {
    //     res.status(400).send(err);
    // });
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        if(!user) res.status(404).send('user not found');
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
    //User.find({}).then((users)=>res.send(users)).catch((e)=>res.status(500).send(e));
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const updateIsValid = updates.every((update) => allowedUpdates.includes(update));

    if(!updateIsValid) {
        res.status(400).send({ error: 'Request is invalid' });
    }

    try {
        const user = req.user;

        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();

        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        
        res.send(user);
    } catch (e) {
        res.status(500).send(e); // This will catch error form run validators
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const deletedUser = await User.findByIdAndDelete(req.user._id);

        // if(!deletedUser) {
        //     res.status(404).send('User not found');
        // }

        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

// multer upload options
const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            cb(new Error('File extension not supported'));
        }

        cb(null, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if(!user || !user.avatar) {
            throw new Error();
        };

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;