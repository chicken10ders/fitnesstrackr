// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router

const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/health", (req, res, next) => {
  try {
    res.send({ message: "The server is healthy!" });
  } catch (error) {
    next(error);
  }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

const routineRouter = require("./routine");
apiRouter.use("/routine", routineRouter);

module.exports = apiRouter;
