const express = require('express');
const { getProfile } = require('../controllers/profileController');

const router = express.Router();

router.get('/profile/:username', getProfile);

module.exports = router;
