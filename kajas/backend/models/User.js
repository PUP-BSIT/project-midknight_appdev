const db = require('../config/db');

const createUser = (userInfoId, username, email, password, callback) => {
  const query = 'INSERT INTO user (user_information_id, username, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [userInfoId, username, email, password], callback);
};

const verifyUser = (email, callback) => {
  const verify = 1;
  const query = 'UPDATE user SET is_verify = ? WHERE email = ?';
  db.query(query, [verify, email], callback);
}

const getAllUsernames = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT username FROM user';
    db.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }
      const usernames = results.map(row => row.username);
      resolve(usernames);
    });
  });
};

module.exports = {
  createUser,
  verifyUser,
  getAllUsernames
};