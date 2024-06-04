const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getProfile, getLocation, setupProfile } = require('../controllers/profileController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = '../uploads/';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage: storage });

router.get('/profile/:username', getProfile);
router.get('/location/id', getLocation);
router.post('/setProfile/',upload.single('profile'), setupProfile);

module.exports = router;
