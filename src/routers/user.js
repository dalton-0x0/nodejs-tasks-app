const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

// sign up new user
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

// log in user
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

// log out user
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send("logout success");
    } catch (e) {
        res.status(500).send();
    }
});

// logout user from all devices
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send("logout all success");
    } catch (e) {
        res.status(500).send();
    }
});

// view current user profile
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

// users should not be able to see all other users' profiles -> /users/me
/*
router.get("/users", async (req, res) => {  
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send();
    }

});
*/

// users should only be able to see their own profiles -> /users/me
/*
router.get("/users/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(404).send();
    }
});
*/

// user should be able to update their profile
router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "invalid updates!" });
    }
    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));

        await req.user.save();

        res.status(200).send(req.user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// users should be able to delete their profiles
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();

        res.status(200).send(req.user);
    } catch (err) {
        res.status(500).send();
    }
});

// uploading files
const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('upload .jpg, .jpeg or .png image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send()
    }
})

module.exports = router;
