const db = require('../config/db');

const createUser = (userInfoId, username, email, password, callback) => {
  const query = 'INSERT INTO user (user_information_id, username, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [userInfoId, username, email, password], callback);
};

const verifyUser = (email, callback) => {
  const query = 'SELECT COUNT (*) as count FROM user WHERE email = ?';
  db.query(query, [email], callback);
}

module.exports = {
  createUser,
  verifyUser
};
