const { callbackPromise } = require('nodemailer/lib/shared');
const db = require('../config/db');

const createUserInformation = (firstName, middleName, lastName, callback) => {
  const query = 'INSERT INTO user_information (first_name, middle_name, last_name) VALUES (?, ?, ?)';
  db.query(query, [firstName, middleName, lastName], callback);
};

const updateUserInformation = (id, profile, bio, kajasLink, callback) => {
  const query = `UPDATE user_information SET profile = ?, bio = ?, kajas_link = ?, country = ?, city = ?  WHERE user_information_id = 1`;
  db.query(query, [profile, bio, kajasLink, country, city, id], callback);
} 

const addSocialLinks = (id, platform, url, callback) => {
  const query = 'INSERT INTO social_links (platform, url) VALUES (?, ?)';
  db.query(query, [platform, url], callback);
};

module.exports = {
  createUserInformation,
  updateUserInformation,
  addSocialLinks
};
