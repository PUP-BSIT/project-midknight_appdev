const db = require("../config/db");
const bcrypt = require('bcrypt');

const createUser = (userInfoId, username, email, password, callback) => {
  const query = "INSERT INTO user (user_information_id, username, email, password) VALUES (?, ?, ?, ?)";
  db.query(query, [userInfoId, username, email, password], callback);
};

const verifyUser = (email, callback) => {
  const verify = 1;
  const query = "UPDATE user SET is_verify = ? WHERE email = ?";
  db.query(query, [verify, email], callback);
};

const findUserByEmail = (email, callback) => {
  const query = `SELECT user.*, user_information.* FROM user LEFT JOIN user_information ON user.user_information_id 
  = user_information.user_information_id WHERE user.email = ?;`;
  db.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results[0]);
  });
};

const setPasswordResetToken = (email, token, expires, callback) => {
  const query = "UPDATE user SET reset_token = ?, reset_token_expires = ? WHERE email = ?";
  db.query(query, [token, expires, email], callback);
};

const findUserByResetToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM user WHERE reset_token = ?";
    db.query(query, [token], (err, results) => {
      if (err || !results.length) {
        return reject(err || new Error('User not found'));
      }
      resolve(results[0]);
    });
  });
};

const updatePassword = (email, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE user SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?";
    db.query(query, [hashedPassword, email], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

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

const getUserProfile = (username, callback) => {
  const query = `
    SELECT u.user_id, u.username, u.email, ui.profile, ui.bio, ui.first_name, ui.middle_name, ui.last_name, ui.country, ui.city, ui.kajas_link,
    ui.facebook, ui.linkedin, ui.instagram, ui.website
    FROM user u
    JOIN user_information ui ON u.user_information_id = ui.user_information_id
    WHERE u.username = ?
    AND u.is_active = 1
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (!results.length) {
      return callback(null, null);
    }
    const userProfile = results[0];

    const artworksQuery = 'SELECT * FROM artworks WHERE user_id = ? AND status = 1';
    db.query(artworksQuery, [userProfile.user_id], (err, artworks) => {
      if (err) {
        return callback(err, null);
      }
      userProfile.artworks = artworks;

      callback(null, userProfile);      
    });
  });
};

const getLocation = (id, callback) => {
  const query = "SELECT country, city FROM user_information WHERE user_information_id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    
    const { country, city } = results[0];
    if (!country && !city) {       
      return callback(err, null);
    }    
    return callback(null, results[0]);
  });

}

const updateUsername = (id, username, callback) => {
  const query = "UPDATE user SET username = ? WHERE user_information_id = ?";
  db.query(query, [username, id], callback);
};

const searchUsers = (query) => {
  return new Promise((resolve, reject) => {
    const searchQuery = `
      SELECT u.username, ui.profile, ui.first_name AS firstName, ui.last_name AS lastName 
      FROM user u
      JOIN user_information ui ON u.user_information_id = ui.user_information_id
      WHERE (ui.first_name LIKE ? OR ui.last_name LIKE ?)
      AND u.is_active = 1
      LIMIT 5`;
    db.query(searchQuery, [`${query}%`, `${query}%`], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const getUserProfileById = (id, callback) => {
  const query = `
    SELECT u.user_id, u.username, u.email, ui.profile, ui.bio, ui.first_name, ui.middle_name, ui.last_name, ui.country, ui.city, ui.kajas_link,
    ui.facebook, ui.linkedin, ui.instagram, ui.website
    FROM user u
    JOIN user_information ui ON u.user_information_id = ui.user_information_id
    WHERE u.user_id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (!results.length) {
      return callback(null, null);
    }
    const userProfile = results[0];

    const artworksQuery = 'SELECT * FROM artworks WHERE user_id = ? AND status = 1';
    db.query(artworksQuery, [userProfile.user_id], (err, artworks) => {
      if (err) {
        return callback(err, null);
      }
      userProfile.artworks = artworks;

      callback(null, userProfile);      
    });
  });
};

const changePassword = async (email, currentPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT password FROM user WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        return reject(err);
      }

      if (!results.length) {
        return reject(new Error('User not found'));
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return reject(new Error('Incorrect current password'));
      }

      const newPasswordMatch = await bcrypt.compare(newPassword, user.password);
      if (newPasswordMatch) {
        return reject(new Error('New password cannot be the same as the old password'));
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updateQuery = "UPDATE user SET password = ? WHERE email = ?";
      db.query(updateQuery, [hashedNewPassword, email], (updateErr, updateResults) => {
        if (updateErr) {
          return reject(updateErr);
        }
        resolve(updateResults);
      });
    });
  });
};

const findById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT u.user_id, u.username, u.email, ui.profile, ui.bio, ui.first_name, ui.middle_name, ui.last_name, ui.country, ui.city, ui.kajas_link,
      ui.facebook, ui.linkedin, ui.instagram, ui.website
      FROM user u
      JOIN user_information ui ON u.user_information_id = ui.user_information_id
      WHERE u.user_id = ?
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (!results.length) {
        return resolve(null);
      }
      const userProfile = results[0];

      const artworksQuery = 'SELECT * FROM artworks WHERE user_id = ? AND status = 1';
      db.query(artworksQuery, [userProfile.user_id], (err, artworks) => {
        if (err) {
          return reject(err);
        }
        userProfile.artworks = artworks;
        resolve(userProfile);      
      });
    });
  });
};

const comparePassword = (userId, candidatePassword) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT password FROM user WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
      if (err) {
        return reject(err);
      }

      if (!results.length) {
        return reject(new Error('User not found'));
      }

      const user = results[0];
      bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        if (err) {
          return reject(err);
        }
        resolve(isMatch);
      });
    });
  });
};

const updateUserEmail = (userId, newEmail) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE user SET email = ? WHERE user_id = ?";
    db.query(query, [newEmail, userId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const deactivateUser = (userId, callback) => {
  const query = "UPDATE user SET is_active = 0 WHERE user_id = ?";
  db.query(query, [userId], callback);
};

const reactivateUser = (userId, callback) => {
  const query = "UPDATE user SET is_active = 1 WHERE user_id = ?";
  db.query(query, [userId], callback);
};

module.exports = {
  createUser,
  verifyUser,
  findUserByEmail,
  setPasswordResetToken,
  findUserByResetToken,
  updatePassword,
  getAllUsernames,
  getUserProfile,
  getLocation,
  updateUsername,
  searchUsers,
  getUserProfileById,
  changePassword,
  findById,
  comparePassword,
  updateUserEmail,
  deactivateUser,
  reactivateUser
};