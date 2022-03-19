const express = require("express");
const {
  getUserByUsername,
  createUser,
  getUser,
  getPublicRoutinesByUser,
} = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env;
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
  const user = await getUser(req.body);

  if (!user) {
    return res.status(400).send({ error: "bad user" });
  }
  const token = jwt.sign(user, process.env.JWT_SECRET);
  res.send({ token });
});

usersRouter.get("/me", (req, res) => {
  if (!req.user) {
    res.status(400).send("no user");
  }
  const token = jwt.sign(user, process.env.JWT_SECRET);
  if (token) {
    res.send(req.user);
  }
});

usersRouter.get("/:username/routines", async (req, res) => {
  const user = await getUserByUsername(req.params.username);
  const routines = await getPublicRoutinesByUser({ id: user.id });
  res.send(routines);
});

module.exports = usersRouter;
