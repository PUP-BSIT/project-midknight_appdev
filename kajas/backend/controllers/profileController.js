const User = require('../models/User');

const getProfile = (req, res) => {
  const { username } = req.params;

  User.getUserProfile(username, (err, profile) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(profile);
  });
};

module.exports = {
  getProfile
};
