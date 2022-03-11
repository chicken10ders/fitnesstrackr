const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows } = await client.query(
      `
    INSERT INTO routine_activities ("routineId", "activityId", count, duration) VALUES ($1,$2,$3,$4) RETURNING*`,
      [routineId, activityId, count, duration]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = { addActivityToRoutine };
