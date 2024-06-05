const express = require('express');
const { resetPassword } = require('../controllers/reset-password');

const router = express.Router();

router.post('/api/reset-password', resetPassword);

module.exports = router;
