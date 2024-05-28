const { log } = require('@angular-devkit/build-angular/src/builders/ssr-dev-server');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'midknightv03@kajas.site',
        pass: 'Kajas_123'
    }
});

const mailer =  async (req, res) => {
    try {
        const { email } = req.body
        console.log(email);
        const mailOptions = {
            from: 'midknightv03@kajas.site',
            to: email,
            subject: 'Email Verification',
            html: `<p>We hope this email finds you well.</p>
            <p>To complete your registration and activate your account, we need 
            to verify your email address. Please take a moment to confirm your 
            email address by clicking the link below:</p>

            <p><a href="http://localhost:4000/api/verify?email=${email}">Verify Email Address</a></p>

            <p>Verifying your email address ensures that you can receive important 
            updates and information about your account. If you did not sign up for 
            this account or believe you received this message in error, please disregard this email.</p>
            <p>For any questions or assistance, feel free to contact our support team.</p>
            <p>Thank you for your cooperation.</p>

            <p>Best regards,</p>
            <p>KAJAS team</p>`              
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ title: "Success", msg: 'Thank you for signing up! Please check your email for a verification message to complete the account activation.' });
        
      } catch (error) {
            console.log(error);
          return res.status(500).json({ title: "Internal Error", msg: "Something went wrong! Please try again later." });
      }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        User.findUserByEmail(email, async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            const expires = Date.now() + 3600000; // 1 hour

            const mailOptions = {
                from: 'midknightv03@kajas.site',
                to: email,
                subject: 'Password Reset',
                html: `
                    <p>You requested a password reset.</p>
                    <p>Click the link below to reset your password:</p>
                    <p><a href="http://localhost:4200/reset-password?token=${token}">Reset Password</a></p>
                    <p>This link will expire in 1 hour.</p>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                User.setPasswordResetToken(email, token, expires, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    res.status(200).json({ message: 'Password reset email sent' });
                });
            } catch (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { mailer, forgotPassword }