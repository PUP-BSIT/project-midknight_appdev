const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.deactivateAccount = (req, res) => {
  const { userId, password } = req.body;

  User.comparePassword(userId, password)
    .then(isMatch => {
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
      User.deactivateUser(userId, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Server error', err });
        }
        res.status(200).json({ message: 'Account deactivated successfully' });
      });
    })
    .catch(err => res.status(500).json({ message: 'Server error', err }));
};

exports.reactivateAccount = (req, res) => {
  const { userId } = req.body;

  User.reactivateUser(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Server error', err });
    }
    res.status(200).json({ message: 'Account reactivated successfully' });
  });
};
