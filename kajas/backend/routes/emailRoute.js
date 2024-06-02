const express = require('express');
const { mailer, forgotPassword } = require('../controllers/mailer')

const router = express.Router();

router.post('/send/email', mailer);
router.post('/send/resetLink', forgotPassword);

module.exports = router;