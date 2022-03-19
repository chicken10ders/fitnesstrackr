const express = require("express");
const routineRouter = express.Router();
const {
  getAllPublicRoutines,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require("../db");

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
    const routineActivities = await getRoutineActivitiesByRoutine({
      id: routineId,
    });
    const oldRoutineActivities =
      routineActivities &&
      routineActivities.filter(
        (routineActivity) => routineActivity.activityId === activityId
      );
    if (oldRoutineActivities && oldRoutineActivities.length) {
      next({
        message: "This routine activity already exists.",
      });
    } else {
      const newActivity = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
      res.send(newActivity);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = routineRouter;
