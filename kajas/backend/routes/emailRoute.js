const express = require('express');
const { mailer } = require('../controllers/mailer')

const router = express.Router();

router.post('/send/email', mailer);

module.exports = router;