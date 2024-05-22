const db = require('../config/db');

const createUser = (userInfoId, username, email, password, callback) => {
  const query = 'INSERT INTO user (user_information_id, username, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [userInfoId, username, email, password], callback);
};

module.exports = {
  createUser
};
