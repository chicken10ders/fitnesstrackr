const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities, getPublicRoutinesByActivity } = require("../db");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  try {
    const routines = await getPublicRoutinesByActivity({
      id: req.params.activityId,
    });
    if (routines) {
      res.send(routines);
    } else {
      next({
        message: "No routines found for this activity.",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;
