const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/tasks-mongoose", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // useFindAndModify: false,
});

const User = mongoose.model("User", {
    name: {
        type: String,
    },
    age: {
        type: Number,
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

const task = new Task({
    description: "water the plants",
    completed: false,
});

task.save()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log("error msg: ", err);
    });
