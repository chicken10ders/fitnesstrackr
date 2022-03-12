const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username,password) VALUES($1,$2) RETURNING *`,
      [username, hashedPassword]
    );

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordsMatch) {
      delete user.password;
      return user;
    }
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
  getUser,
};
