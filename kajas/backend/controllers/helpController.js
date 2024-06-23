const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, 
  auth: {
    user: 'midknightv03@kajas.site',
    pass: 'Kajas_123'
  }
});

exports.submitHelpRequest = async (req, res) => {
  const message = req.body.message;
  const image = req.file;
  const email = req.body.email;

  if (!message || message.length < 10) {
    return res.status(400).json({ message: 'Message is required and should be at least 10 characters long.' });
  }

  const issueData = {
    message: message,
    imagePath: image ? image.path : null,
    email: email
  };

  const mailOptions = {
    from: 'midknightv03@kajas.site',
    to: 'midknightv03@gmail.com', 
    subject: 'New Help Request',
    html: `
      <div style="margin-left: 23px; overflow: hidden; max-width: 100%; font-family: Arial, sans-serif;">
        <h1 style="color: #4D493E; font-size: xx-large; margin: 0; margin-bottom: 8px;">New Help Request</h1>
        <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">From: ${email}</p>
        <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Message: ${message}</p>
      </div>
    `,
    attachments: image ? [
      {
        filename: image.filename,
        path: image.path
      }
    ] : []
  };

  try {
    await transporter.sendMail(mailOptions);
    setTimeout(() => {
      res.status(200).json({ message: 'Issue submitted successfully!', issueData });
    }, 1000);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
};
