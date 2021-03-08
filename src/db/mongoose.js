const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/tasks-mongoose", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // useFindAndModify: false,
});

const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('age must be a positive number')
            }
        }
    },
});

const Task = mongoose.model("Task", {
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
    },
});

// const user = new User({
//     name: "April Mitchell",
//     age: "twenty",
// });

// user.save()
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log("error msg: ", err);
//     });

// User.updateOne(
//     { _id: "6045624c4486f74ee5ace49e" },
//     { name: "Dwayne Wade", age: 35 }
// );

// const task = new Task({
//     description: "water the plants",
//     completed: false,
// });

// task.save()
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log("error msg: ", err);
//     });
