const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "Ben Snow",
            email: "ben@email.com",
            password: "cookies123",
        })
        .expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assert the response body
    expect(response.body).toMatchObject({
        user: {
            name: "Ben Snow",
            email: "ben@email.com",
        },
        token: user.tokens[0].token,
    });

    // Assert that the password is hashed
    expect(user.password).not.toBe("cookies123");
});

test("Should login existing user", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);
    const user = await User.findById(userOneId);

    // Assert that login token is created
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: "nopassword",
        })
        .expect(400);
});

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
    await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(userOneId);

    // Assert that the user is indeed deleted
    expect(user).toBeNull();
});

test("Should not delete account for an unauthenticated user", async () => {
    await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/profile-pic.jpg")
        .expect(200);
    const user = await User.findById(userOneId);

    // Assert that profile-pic was uploaded
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update a valid user field e.g. name", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Jess",
        })
        .expect(200);
    const user = await User.findById(userOneId);

    // Assert that the user name was updated
    expect(user.name).toEqual("Jess");
});

test("Should not update invalid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Houston",
        })
        .expect(400);
});