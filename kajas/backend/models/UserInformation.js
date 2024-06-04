const { callbackPromise } = require('nodemailer/lib/shared');
const db = require('../config/db');

const createUserInformation = (firstName, middleName, lastName, callback) => {
  const query = 'INSERT INTO user_information (first_name, middle_name, last_name) VALUES (?, ?, ?)';
  db.query(query, [firstName, middleName, lastName], callback);
};

const updateUserInformation = (id, profile, bio, kajasLink, country, city, facebook, linkedin, instagram, website, callback) => {
  try{
    const query = `
    UPDATE user_information 
    SET profile = ?, bio = ?, kajas_link = ?, country = ?, city = ?, facebook = ?, linkedin = ?, instagram = ?, website = ? 
    WHERE user_information_id = ?`; 

  db.query(query, [profile, bio, kajasLink, country, city, facebook, linkedin, instagram, website, id], callback);
  }catch (err){
    console.error(err);
  }
};


module.exports = {
  createUserInformation,
  updateUserInformation
};
