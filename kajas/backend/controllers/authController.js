const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserInformation = require('../models/UserInformation');
const db = require('../config/db')

const signup = async (req, res) => {
  const { username, email, password, confirmPassword, firstName, middleName, lastName } = req.body;

  // Validate input
  if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
    return res.status(400).json({ message: 'All required fields must be filled out' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert into user_information table
  UserInformation.createUserInformation(firstName, middleName, lastName, (err, result) => {
    if (err) {
      console.error('Error inserting into user_information table:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const userInformationId = result.insertId;

    // Insert into user table
    User.createUser(userInformationId, username, email, hashedPassword, (err, result) => {
      if (err) {
        console.error('Error inserting into user table:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

const { query } = require('express')
const pool = require ('./src/database/database')

const verifyAccount = async (req, res) => {
    try {
        const { email } = req.body
        User.verifyUser (email, (error, res) => {
            if (error) 
                return res.status(404).json({ title: "Internal Error", msg: "Not found!" });
            const exist = res[0].count
            if (exist == 0) {
                return res.status(404).json({ title: "Internal Error", msg: "Not found!" });
            }
            return res.status(200).json({ title: "Account Verified", msg: "Your account has been verified!" });
        })
        
    } catch (error) {
        return res.status(500).json({ title: "Internal Error", msg: "Something went wrong!" });
    }
}

module.exports = {
  signup,
  verifyAccount
};

