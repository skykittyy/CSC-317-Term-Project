const db = require('./db');

// Register a new user (plain text password)
function registerUser({ name, email, username, password }) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email, username, password], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, name, email, username });
    });
  });
}

// Login a user (plain text password)
function loginUser({ username, password }) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1`;
    db.get(sql, [username, password], (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error('Invalid username or password'));

      const { password, ...userWithoutPassword } = user;
      resolve(userWithoutPassword);
    });
  });
}

module.exports = {
  registerUser,
  loginUser
};
