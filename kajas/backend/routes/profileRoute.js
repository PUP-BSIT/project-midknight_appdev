const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  submitArtwork,
  getProfile,
  getLocation,
  setupProfile,
  getGallery,
  getArtworkDetailsByTitleAndId,
  deleteAnArtwork,
} = require('../controllers/profileController');

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
  },
});

const upload = multer({ storage: storage });

router.get('/profile/:username', getProfile);
router.get('/location/id', getLocation);
router.post('/setProfile/', upload.single('profile'), setupProfile);
router.get('/artworks/id', getGallery);
router.get('/artwork/title/:title/id/:id', getArtworkDetailsByTitleAndId);
router.post('/artwork/delete/:artwork_id', deleteAnArtwork);
router.post('/artwork/submit', upload.single('imageUrl'), submitArtwork);

module.exports = router;
