const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users (username, password) VALUES ($1, $2) RETURNING*;`,
      [username, password]
    );
    // const SALT_COUNT = 10;

    // const hash = await bcrypt.hash(
    //   password,
    //   SALT_COUNT,
    //   function (err, hashedPassword) {
    //     createUser({
    //       username,
    //       password: hashedPassword,
    //     });
    //   }
    // );

    delete user.password;
    return user;
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

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users WHERE id = $1`,
      [id]
    );

    delete user.password;
    // console.log(user.rows[0]);
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const user = await client.query(
      `
        SELECT * FROM users WHERE username = $1`,
      [username]
    );
    delete user.rows[0].password;
    // console.log(user.rows[0]);
    return user.rows[0];
  } catch (error) {
    throw error;
  }
}
getUserByUsername("albert");

module.exports = {
  createUser,
  getUserById,
};
