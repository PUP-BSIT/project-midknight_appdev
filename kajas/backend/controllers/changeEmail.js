const User = require('../models/User');
const { transporter } = require('./mailer'); 
const bcrypt = require('bcrypt');
const emailStyles = require('./emailStyles');

const changeEmail = async (req, res) => {
  try {
    const { userId, newEmail, currentEmail, password } = req.body;
    const user = await User.findById(userId);

    if (!newEmail || !userId || !currentEmail || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await User.comparePassword(userId, password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    await User.updateUserEmail(userId, newEmail);

    const mailOptions = {
      from: 'midknightv03@kajas.site',
      to: newEmail,
      subject: 'Email Change Confirmation',
      html: `
          <!DOCTYPE html>
          <html>
          <head>
              <title>Email Change Confirmation</title>
              <style>${emailStyles}</style>
          </head>
          <body>
              <div class="container">
                  <div class="logo">
                      <img src="cid:logo.png" alt="Logo">
                  </div>
                  <div class="content">
                      <h1>Email Change Confirmation</h1>
                      <p>We wanted to let you know that your email address 
                        associated with your Kajas account has been successfully
                        updated.</p>
                      <p>Your new email address is: 
                        <strong>${newEmail}</strong></p>
                      <p>If you did not request this change, please contact our
                        support team immediately at 
                      <a class="mail" href="mailto:midknightv03@gmail.com">
                        midknightv03@gmail.com</a>.</p>
                      <p>Thank you for using Kajas!</p>
                      <p>Best regards, <span class="team">
                        Team Midknight</span></p>
                  </div>
              </div>
          </body>
          </html>
      `,
      attachments: [{
          filename: 'kajas_icon.png',
          path: __dirname + '/../../src/assets/kajas_icon.png',
          cid: 'logo.png'
      }]
  };

    await transporter.sendMail(mailOptions); 

    res.status(200).json({ message: 'Email changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { changeEmail };
