const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post(('/tasks'), auth, async (req, res) => {
    //const newTask = new Task(req.body);
    const newTask = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        const task = await newTask.save();
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

    //newTask.save().then(() => res.status(201).send(newTask) ).catch((e) => res.status(400).send(e));
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20  // skip 20 result and get the 3rd set of 10
// GET /tasks?sortBy=createdAt_desc or createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === "true"; // the === will return true, thus assigning true value to match.completed
    };

    if (req.query.sortBy) {
        const part = req.query.sortBy.split(':');
        sort[part[0]] = part[1] === 'desc' ? -1 : 1;
    };

    try {
        //const tasks = await Task.find({});
        await req.user.populate({
            path: 'user_tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        
        res.send(req.user.user_tasks);
    } catch (e) {
        res.status(500).send(e);
    }

    //Task.find({}).then((tasks) => res.send(tasks)).catch((e) => res.status(500).send(e));
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });

        if(!task){
            res.status(404).send();
        }
        
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         res.status(404).send();
    //     }
    //     res.send(task);
    // }).catch((e) => res.status(500).send(e));
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body); // ['description','completed']
    const allowedUpdates = ['description', 'completed'];
    const updateIsValid = updates.every((update) => allowedUpdates.includes(update));

    if(!updateIsValid) {
        res.status(400).send({error: 'Request is invalid'});
    }

    try {
        // long way
        //if (task.owner === req.user._id) xxx;

        // using object query
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true } );
        if(!task) {
            res.status(404).send();
        };

        updates.forEach((update) => task[update] = req.body[update]);

        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send(e); // This will catch error form run validators
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if(!task) {
            res.status(404).send('Task not found');
        }

        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;