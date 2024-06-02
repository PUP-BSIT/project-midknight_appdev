const { callbackPromise } = require('nodemailer/lib/shared');
const db = require('../config/db');

const createUserInformation = (firstName, middleName, lastName, callback) => {
  const query = 'INSERT INTO user_information (first_name, middle_name, last_name) VALUES (?, ?, ?)';
  db.query(query, [firstName, middleName, lastName], callback);
};

const updateUserInformation = (id, firstName, middleName, lastName, email, bio, country, city, kajasLink, facebook, linkedin, instagram, website, callback) => {
  const query = `
    UPDATE user_information 
    SET first_name = ?, middle_name = ?, last_name = ?, email = ?, bio = ?, country = ?, city = ?, kajas_link = ?, facebook = ?, linkedin = ?, instagram = ?, website = ? 
    WHERE user_information_id = 1`;
  db.query(query, [firstName, middleName, lastName, email, bio, country, city, kajasLink, facebook, linkedin, instagram, website, id], callback);
};


module.exports = {
  createUserInformation,
  updateUserInformation
};
