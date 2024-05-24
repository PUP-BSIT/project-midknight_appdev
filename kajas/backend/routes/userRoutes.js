const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/usernames', async (req, res) => {
  try {
    const usernames = await User.getAllUsernames();
    res.status(200).json(usernames);
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
