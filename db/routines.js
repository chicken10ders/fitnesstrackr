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

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT r.*, users.username AS "creatorName" FROM routines AS r
    JOIN users ON users.id = r."creatorId"`);

    for (const routine of rows) {
      const { rows: activities } = await client.query(
        `
      SELECT a.*, ra.id AS routine_activitiesId, ra.duration, ra.count
      FROM activities AS a
      JOIN routine_activities AS ra ON ra."activityId" = a.id
      WHERE ra."routineId" = $1;
      `,
        [routine.id]
      );
      routine.activities = activities;
    }

    // console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT r.*, users.username AS "creatorName" FROM routines AS r
    JOIN users ON users.id = r."creatorId"
    WHERE "isPublic" = true`);

    for (const routine of rows) {
      const { rows: activities } = await client.query(
        `
        SELECT a.*, ra.id AS routine_activitiesId, ra.duration, ra.count
        FROM activities AS a
        JOIN routine_activities AS ra ON ra."activityId" = a.id
        WHERE ra."routineId" = $1`,
        [routine.id]
      );
      routine.activities = activities;
    }

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
    SELECT r.*, users.username AS "creatorName" FROM routines AS r
    JOIN users ON users.id = r."creatorId"
    WHERE username = $1`,
      [username]
    );
    for (const routine of rows) {
      const { rows: activities } = await client.query(
        `
        SELECT a.*, ra.id AS routine_activitiesId, ra.duration, ra.count
        FROM activities AS a 
        JOIN routine_activities AS ra ON ra."activityId" = a.id
        WHERE ra."routineId" = $1`,
        [routine.id]
      );
      routine.activities = activities;
    }

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
    SELECT r.*, users.username AS "creatorName" FROM routines AS r
    JOIN users ON users.id = r."creatorId"
    WHERE "isPublic" = true AND username = $1`,
      [username]
    );
    for (const routine of rows) {
      const { rows: activities } = await client.query(
        `
      SELECT a.*, ra.id AS routine_activitesId, ra.duration, ra.count
      FROM activities AS a
      JOIN routine_activities AS ra ON ra."activityId" = a.id
      WHERE ra."routineId" = $1`,
        [routine.id]
      );
      routine.activities = activities;
    }
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      //   `
      // SELECT r.*, users.username AS "creatorName" FROM routines AS r
      // JOIN users ON users.id = r."creatorId"
      // JOIN routine_activities ON ra."routineId" FROM
      // WHERE routines."isPublic" = true AND ra."activityId" = $1`,

      `
    
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users on users.id = routines."creatorId"
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic" = true
    AND routine_activities."activityId" = $1`,
      [id]
    );

    for (let routine of routines) {
      const { rows: activities } = await client.query(
        `
      SELECT a.*, ra.id AS routine_activitiesId, ra.duration, ra.count 
      FROM activities AS a
      JOIN routine_activities AS ra ON a.id = ra."activityId"
      WHERE ra."routineId" = $1;`,
        [routine.id]
      );
      routine.activities = activities;
    }
    return routines;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, isPublic, name, goal }) {
  try {
    if (id != undefined) {
      if (isPublic) {
        client.query(
          `
        UPDATE routines
        SET "isPublic" = $1
        WHERE id = $2;`,
          [isPublic, id]
        );
      }
    }
    if (name) {
      client.query(
        `
        UPDATE routines
        SET name = $1
        WHERE id = $2;`,
        [name, id]
      );
    }
    if (goal) {
      client.query(
        `
      UPDATE routines
      SET goal = $1
      WHERE id = $2;`,
        [goal, id]
      );
    }
    const {
      rows: [routines],
    } = await client.query(
      `
      SELECT * FROM routines
    
    WHERE id = $1
    `,
      [id]
    );
    return routines;
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
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  updateRoutine,
};
