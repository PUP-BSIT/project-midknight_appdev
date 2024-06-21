const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const result = await User.changePassword(email, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully!' });
  } catch (error) {
    if (error.message === 'Incorrect current password') {
      res.status(401).json({ message: 'Incorrect current password' });
    } else if (error.message === 'New password cannot be the same as the old password') {
      res.status(400).json({ message: 'New password cannot be the same as the old password' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

module.exports = router;
