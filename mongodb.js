const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "tasks-mongodb";

MongoClient.connect(
    connectionURL,
    { useUnifiedTopology: true },
    (error, client) => {
        if (error) {
            return console.log("unable to connect to db");
        }

        const db = client.db(dbName);
        /*
        db.collection("users").insertOne({
            name: "James Brown",
            age: 35,
        }, (error, result) => {
            if (error) {
                return console.log('unable to insert document to collection')
            }
            console.log(result.ops)
        });
        */

        /*
        db.collection("users").insertMany(
            [
                {
                    name: "Adamu Traore",
                    age: 29,
                },
                {
                    name: "Jen McAdams",
                    age: 23,
                },
                {
                    name: "Sara Jones",
                    age: 27,
                },
            ],
            (error, result) => {
                if (error) {
                    return console.log("unable to insert documents to collection");
                }
                console.log(result.ops);
            }
        );
        */
                /*
        db.collection("tasks").insertMany(
            [
                {
                    description: "cook pasta",
                    completed: true,
                },
                {
                    description: "empty trash",
                    completed: false,
                },
                {
                    description: "do laundry",
                    completed: true,
                },
            ],
            (error, result) => {
                if (error) {
                    return console.log("unable to insert documents to collection");
                }
                console.log(result.ops);
            }
        );
        */
        /*
        db.collection("users")
            .updateOne(
                {
                    _id: new ObjectID("604531f3cae12643058f17b5"),
                },
                { $set: { name: "Dwayne Wade", age: 25 } }
            )
            .then((res) => {
                console.log(res.modifiedCount);
            })
            .catch((err) => console.log(err));
        */
        /*
        db.collection("users").findOne({ name: "Jen Adams" }, (error, user) => {
            if (error) {
                return console.log("unable to fetch");
            }
            console.log(user);
        });
        */
        /*
        db.collection("users")
            .find({ age: 24 })
            .toArray((error, users) => {
                if (error) {
                    return console.log("unable to find users");
                }
                console.log(users);
            });
        */
        /*
        db.collection("users")
            .find({ age: 24 })
            .count((error, count) => {
                if (error) {
                    return console.log("unable to find users");
                }
                console.log(`${count} users found!`);
            });
        */
    }
);
