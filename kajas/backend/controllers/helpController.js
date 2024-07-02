const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const emailStyles = require('./emailStyles');

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
        <!DOCTYPE html>
        <html>
        <head>
            <title>New Help Request</title>
            <style>${emailStyles}</style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <img src="cid:logo.png" alt="Logo">
                </div>
                <div class="content">
                    <h1>New Help Request</h1>
                    <p>From: ${email}</p>
                    <p>Message: ${message}</p>
                </div>
            </div>
        </body>
        </html>
    `,
    attachments: [
        {
            filename: 'kajas_icon.png',
            path: __dirname + '/../../src/assets/kajas_icon.png',
            cid: 'logo.png'
        },
        ...(image ? [{
            filename: image.filename,
            path: image.path
        }] : [])
    ]
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
