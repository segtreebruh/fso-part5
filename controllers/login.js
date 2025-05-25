const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  // 401 unauthorized
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid credentials",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET_KEY, { expiresIn: 60*60 });

  response.status(200).send({ token, username: username, name: user.name });
});

module.exports = loginRouter;
