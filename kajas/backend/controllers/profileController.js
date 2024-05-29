const User = require('../models/User');
const { updateUserInformation } = require('../models/UserInformation');

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

const getLocation = async (req, res) => {
  const {id} = req.params
  User.getLocation (id, (error, result) => {
    if (error){
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    const isFirstTImeLogin= result.some(row => row.country == null || row.cty == null);
    res.status(200).json({
      isFirstTImeLogin: isFirstTImeLogin
    });
  })
}

const setupProfile = async (req, res) => {
  const profile = req.file ? req.file.path : null;
  const {id, bio, kajasLink, country, city} = req.body;
  updateUserInformation (id, profile, bio, kajasLink, country, city, (error, result)=> {
    if (error){
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    console.log (result);
    res.status(200).json({ message: 'Success!' });
  })
}

const setupSocialLinks = async (req, res) => {
  const {platform, url} = req.body;
  addSocialLinks (platform, url, (error, result)=> {
    if (error){
      console.error('Error adding social links:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    console.log (result);
    res.status(200).json({ message: 'Success!' });
  })
}


module.exports = {
  getProfile,
  getLocation,
  setupProfile,
  setupSocialLinks
};
