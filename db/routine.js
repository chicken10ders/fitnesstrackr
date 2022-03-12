const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO routines ("creatorId", "isPublic", name, goal) VALUES ($1,$2,$3,$4) RETURNING *`,
      [creatorId, isPublic, name, goal]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
        SELECT * FROM routines`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines(id) {
  try {
    const { rows } = await client.query(`
    SELECT r.*, users.username AS "creatorName" FROM routines AS r
    JOIN users ON users.id = r."creatorId"`);

    for (const routine of rows) {
      const { rows: activities } = await client.query(
        `
      SELECT a.*, ra.id AS routine_activitiesId, ra.duration, ra.count
      FROM activities AS a
      JOIN routine_activies AS ra ON ra."activityId" = a.id
      WHERE ra."routineId" = ($1)
      `,
        [id]
      );
      return activities;
    }

    // console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRoutine,
  getRoutinesWithoutActivities,
  getAllRoutines,
};
