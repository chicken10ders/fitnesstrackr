const express = require("express");
const { user } = require("pg/lib/defaults");
const routineRouter = express.Router();
const {
  getAllPublicRoutines,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  createRoutine,
  updateRoutine,
  destroyRoutine,
} = require("../db");

const { requireUser } = require("./utils");
routineRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});
routineRouter.post("/", requireUser, async (req, res, next) => {
  const routine = req.body;

  try {
    if (req.user) {
      const post = await createRoutine({ ...routine, creatorId: req.user.id });
      // console.log(post);
      res.send(post);
    }
  } catch (error) {
    throw error;
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

routineRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const { isPublic, name, goal } = req.body;
    const routine = await updateRoutine({
      id: routineId,
      isPublic,
      name,
      goal,
    });
    res.send(routine);
  } catch (error) {
    next(error);
  }
});

routineRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const routine = await getRoutineById(routineId);
    console.log(routine);
    const deleteRoutine = await destroyRoutine(routine.id);
    res.send(deleteRoutine);
  } catch (error) {
    next(error);
  }
});

module.exports = routineRouter;
