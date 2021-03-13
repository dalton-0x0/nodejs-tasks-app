const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

// create new task
router.post("/tasks", auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// get all current user's tasks
router.get("/tasks", auth, async (req, res) => {
    try {
        await req.user.populate("tasks").execPopulate();
        res.status(200).send(req.user.tasks);
    } catch (err) {
        res.status(500).send();
    }
});

// get a task by id
router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch {
        res.status(404).send();
    }
});

// update a task by id
router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "invalid updates!" });
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => (task[update] = req.body[update]));

        await task.save();

        res.status(200).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!task) {
            return res.status(404).send();
        }
        
        res.status(200).send(task);
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;
