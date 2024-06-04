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
  const queryKeys = Object.keys(req.query);
  const id = queryKeys[0];
  User.getLocation(id, (error, result) => {
    if (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }    
    if (!result) {
      return res.status(200).json({
        isFirstTimeLogin: 1
       });
    }
    res.status(200).json({ isFirstTimeLogin: 0 });
  });
}

const setupProfile = async (req, res) => {
  try {
    const profile = req.file ? req.file.path : null;
    const { id, bio, kajasLink, country, city, facebook, linkedin, instagram,website} = req.body;
    updateUserInformation (id, profile, bio, kajasLink, country, city, facebook, linkedin, instagram, website, (error, result)=> {
    if (error){
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Success!' });
  })
  }catch (err){
    console.log(err);
  }
}

module.exports = {
  getProfile,
  getLocation,
  setupProfile
};
