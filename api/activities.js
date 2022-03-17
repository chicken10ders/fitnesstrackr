const express = require("express");
const activitiesRouter = express.Router();
const { getAllActivities } = require("../db");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;