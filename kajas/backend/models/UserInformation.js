const { callbackPromise } = require('nodemailer/lib/shared');
const db = require('../config/db');

const createUserInformation = (firstName, middleName, lastName, callback) => {
  const query = 'INSERT INTO user_information (first_name, middle_name, last_name) VALUES (?, ?, ?)';
  db.query(query, [firstName, middleName, lastName], callback);
};

const updateUserInformation = (id, profile, bio, kajasLink, country, city, facebook, linkedin, instagram, website, firstName, middleName, lastName, callback) => {
  const fullKajasLink = `kajas.site/profile/username${kajasLink}`;
  const query = `
    UPDATE user_information 
    SET profile = ?, bio = ?, kajas_link = ?, country = ?, city = ?, facebook = ?, linkedin = ?, instagram = ?, website = ?, first_name = ?, middle_name = ?, last_name = ? 
    WHERE user_information_id = ?`;
  
  db.query(query, [profile, bio, fullKajasLink, country, city, facebook, linkedin, instagram, website, firstName, middleName, lastName, id], callback);
};






module.exports = {
  createUserInformation,
  updateUserInformation
};
