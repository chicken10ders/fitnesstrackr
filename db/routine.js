const client = require("./client");

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    SELECT *
    FROM routines
    WHERE id = $1
    `,
      [id]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

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

async function destroyRoutine(id) {
  try {
    await client.query(
      `
        DELETE FROM routine_activities 
        WHERE "routineId" = $1;
    `,
      [id]
    );
    const {
      rows: [routine],
    } = await client.query(
      `
        DELETE FROM routines 
        WHERE id = $1
        RETURNING *
    `,
      [id]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRoutine,
  getRoutinesWithoutActivities,
  getRoutineById,
  destroyRoutine,
};
