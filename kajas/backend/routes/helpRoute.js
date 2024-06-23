const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { submitHelpRequest } = require('../controllers/helpController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/support', upload.single('image'), submitHelpRequest);

module.exports = router;
