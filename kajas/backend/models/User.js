const db = require("../config/db");

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
  const query = "SELECT * FROM user WHERE email = ?";
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
      if (err || results.length === 0) {
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
    SELECT u.user_id, u.username, u.email, ui.profile, ui.bio, ui.first_name, ui.middle_name, ui.last_name, ui.country, ui.city, ui.kajas_link
    FROM user u
    JOIN user_information ui ON u.user_information_id = ui.user_information_id
    WHERE u.username = ?
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    const userProfile = results[0];

    const artworksQuery = 'SELECT * FROM artworks WHERE user_id = ?';
    db.query(artworksQuery, [userProfile.user_id], (err, artworks) => {
      if (err) {
        return callback(err, null);
      }
      userProfile.artworks = artworks;

      const socialLinksQuery = 'SELECT platform, url FROM social_links WHERE user_information_id = ?';
      db.query(socialLinksQuery, [userProfile.user_information_id], (err, socialLinks) => {
        if (err) {
          return callback(err, null);
        }
        userProfile.social_links = socialLinks;
        console.log('User profile fetched:', userProfile);
        console.log('Artworks fetched:', userProfile.artworks);
        console.log('Social links fetched:', userProfile.social_links);
        callback(null, userProfile);
      });
    });
  });
};

module.exports = {
  createUser,
  verifyUser,
  findUserByEmail,
  setPasswordResetToken,
  findUserByResetToken,
  updatePassword,
  getAllUsernames
};
