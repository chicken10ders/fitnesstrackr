const client = require("./client");

async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `
      INSERT INTO users (username, password) VALUES ($1, $2) RETURNING*;`,
      [username, password]
    );

    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
};
