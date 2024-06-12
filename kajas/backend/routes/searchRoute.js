const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const results = await User.searchUsers(query);
    res.status(200).json({ data: results });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
