const express = require("express");
const routineRouter = express.Router();
const { getAllPublicRoutines, addActivityToRoutine } = require("../db");

routineRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

routineRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;

  try {
    const activity = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });
    res.send(activity);
  } catch (error) {
    next(error);
  }
});

module.exports = routineRouter;
