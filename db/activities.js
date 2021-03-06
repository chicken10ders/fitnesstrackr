const client = require("./client");

async function createActivity({ name, description }) {
  try {
    const { rows } = await client.query(
      `
    INSERT INTO activities (name, description) VALUES ($1, $2) RETURNING*;`,
      [name, description]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  try {
    const { rows } = await client.query(`
        SELECT * FROM activities`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM activities WHERE id = $1`,
      [id]
    );
    // console.log(rows[0]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function updateActivity({ id, name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        UPDATE activities SET name = ($1), description = ($2) WHERE id = ($3) RETURNING *;
        `,
      [name, description, id]
    );

    // console.log(activity);
    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
};
