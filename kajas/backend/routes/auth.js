const express = require('express');
const { signup, verifyAccount } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.get('/verify', verifyAccount);
module.exports = router;