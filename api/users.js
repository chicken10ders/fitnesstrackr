const express = require("express");
const { client } = require("./db/client");
const { getUserByUsername, createUser } = require("../db");
const usersRouter = express.Router();

/*usersRouter.post("/register", async (req, res, next) => {
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
});*/

module.exports = usersRouter;
