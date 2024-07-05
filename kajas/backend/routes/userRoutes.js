const express = require('express');
const db = require("../config/db");
const router = express.Router();
const User = require('../models/User');
const userController = require('../controllers/userController');

router.get('/usernames', async (req, res) => {
  try {
    const usernames = await User.getAllUsernames();
    res.status(200).json(usernames);
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/check-email-exists', (req, res) => {
  const email = req.query.email;
  const query = 'SELECT COUNT(*) AS count FROM user WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const count = results[0].count;
    res.json(count > 0);
  });
});

router.post('/deactivate', userController.deactivateAccount);
router.post('/reactivate', userController.reactivateAccount);

module.exports = router;
