const db = require("../config/db");

const createUser = (userInfoId, username, email, password, callback) => {
  const query =
    "INSERT INTO user (user_information_id, username, email, password) VALUES (?, ?, ?, ?)";
  db.query(query, [userInfoId, username, email, password], callback);
};

const verifyUser = (email, callback) => {
  const verify = 1;
  const query = "UPDATE user SET is_verify = ? WHERE email = ?";
  db.query(query, [verify, email], callback);
};

const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM user WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results[0]);
  });
};

module.exports = {
  createUser,
  verifyUser,
  findUserByEmail,
};
