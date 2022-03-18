const express = require("express");
const { getUserByUsername, createUser, getUserById } = require("../db");
const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      next({
        message: "User already exists",
      });
      return;
    }
    if (password.length < 8) {
      next({
        message: "Password must be at least 8 characters",
      });
      return;
    }
    const user = await createUser({ username, password });

    res.send({
      user,
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "missing username",
      message: "Please have both a username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    if (user && user.password == password) {
      res.send({ message: "Logged In" });
    } else {
      next({
        name: "Incorrect Credentials",
        message: "Username or Password are Incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;
