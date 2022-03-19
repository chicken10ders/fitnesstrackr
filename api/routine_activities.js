const express = require("express");
const routineActivityRouter = express.Router();
const {
  getRoutineActivityById,
  updateRoutineActivity,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("./utils");

routineActivityRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const { count, duration } = req.body;
      const { routineActivityId } = req.params;
      const routine = await getRoutineActivityById(routineActivityId);
      if (
        routine &&
        (await getRoutineById(routine.routineId)).creatorId === req.user.id
      ) {
        const updatedRoutineActivity = await updateRoutineActivity({
          id: req.params.routineActivityId,
          count,
          duration,
        });
        res.send(updatedRoutineActivity);
      } else {
        next({
          message: "You cannot edit this activity.",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

routineActivityRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      //const { count, duration } = req.body;
      const { routineActivityId: id } = req.params;
      const { id: userId } = req.user;
      const routineActivity = await getRoutineActivityById(id);
      const routine = await getRoutineById(routineActivity.routineId);
      if (routine.creatorId === userId) {
        const deleteRoutineActivity = await destroyRoutineActivity(id);
        res.send(deleteRoutineActivity);
      } else {
        next({
          message: "You cannot edit this activity.",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routineActivityRouter;
