const User = require('../models/User');
const { transporter } = require('./mailer'); 
const bcrypt = require('bcrypt');

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
            <div style="margin-left: 23px; overflow: hidden; max-width: 100%; font-family: Arial, sans-serif;">
            <h1 style="color: #4D493E; font-size: xx-large; margin: 0; margin-bottom: 8px;">Email Change Confirmation</h1>
            <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Hello,</p>
            <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">We wanted to let you know that your email address associated with your Kajas account has been successfully updated.</p>
            <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Your new email address is: <strong>${newEmail}</strong></p>
            <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">If you did not request this change, please contact our support team immediately at <a href="mailto:midknightv03@gmail.com" style="color: #4D493E; text-decoration: none;">midknightv03@gmail.com</a>.</p>
            <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Thank you for using Kajas!</p>
            <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Best regards,<br>Team Midknight</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions); 

    res.status(200).json({ message: 'Email changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { changeEmail };
