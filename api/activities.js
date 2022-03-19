const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  getPublicRoutinesByActivity,
  createActivity,
  updateActivity,
} = require("../db");
const { requireUser } = require("./utils");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newActivity = await createActivity({ name, description });
    if (newActivity) {
      res.send(newActivity);
    }
  } catch (error) {
    next(error);
  }
});

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { name, description } = req.body;
    const newActivity = await updateActivity({
      id: activityId,
      name,
      description,
    });
    if (newActivity) {
      res.send(newActivity);
    }
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
