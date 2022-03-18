const express = require("express");
const routineRouter = express.Router();
const { getAllPublicRoutines } = require("../db");

routineRouter.get("/", async (req, res, next) => {
  console.log("hi");
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = routineRouter;
