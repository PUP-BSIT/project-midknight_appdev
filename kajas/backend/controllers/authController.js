const bcrypt = require("bcryptjs");
const User = require("../models/User");
const UserInformation = require("../models/UserInformation");
const db = require("../config/db");

const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      firstName,
      middleName,
      lastName,
    } = req.body;
  
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled out" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    UserInformation.createUserInformation(
      firstName,
      middleName,
      lastName,
      (err, result) => {
        if (err) {
          console.error("Error inserting into user_information table:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
  
        const userInformationId = result.insertId;
  
        User.createUser(
          userInformationId,
          username,
          email,
          hashedPassword,
          (err, result) => {
            if (err) {
              console.error("Error inserting into user table:", err);
              return res.status(500).json({ message: "Internal server error" });
            }
  
            res.status(201).json({ message: "User registered successfully" });
          }
        );
      }
    );

  } catch (error) {
    console.error();
  }
  
};

const verifyAccount = async (req, res) => {
  try {
    const { email } = req.query;
    User.verifyUser(email, (error, result) => {
      if (error) {
        return res
          .status(404)
          .json({ title: "Internal Error", msg: "Not found!" });
      }
      const redirectUrl = 'http://localhost:4200/login';
      return res.redirect(301, redirectUrl);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ title: "Internal Error", msg: "Something went wrong!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  User.findUserByEmail(email, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error." });
    }
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password. Please try again!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password. Please try again!" });
    }

    if (!user.is_verify) {
      return res.status(403).json({ message: "Account not verified." });
    }

    if (!user.is_verify) {
      User.reactivateUser(user.user_id, (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error reactivating account.", err });
        }
        user.is_verify = 1;
        res.status(200).json({ message: "Login Success! Welcome to Kajas!", user });
      });
    } else {
      res.status(200).json({ message: "Login Success! Welcome to Kajas!", user });
    }
  });
};

module.exports = {
  signup,
  verifyAccount,
  login,
};
