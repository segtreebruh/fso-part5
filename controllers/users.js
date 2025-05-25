const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// Read:
// https://codahale.com/how-to-safely-store-a-password/

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1});
  return response.json(users);
})

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  if (username.length <= 3 || password.length <= 3) {
    // call return here 
    // or else will raise error: cannot set headers after sent to client
    return response.status(400).json({
      error: "Username and password must be at least 3 characters"
    })
  }
  // https://github.com/kelektiv/node.bcrypt.js/#a-note-on-rounds 
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    return next(error);
  }
});

module.exports = usersRouter;
