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
        const mailOptions = {
            from: 'midknightv03@kajas.site',
            to: email,
            subject: 'Email Verification',
            html: `
                <div style="margin-left: 23px; overflow: hidden; max-width: 100%; font-family: Arial, sans-serif;">
                <h1 style="color: #4D493E; font-size: xx-large; margin: 0; margin-bottom: 8px;">Email Verification</h1>
                <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">We hope this email finds you well.</p>
                <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">To complete your registration and activate your account, we need to verify your email address. Please take a moment to confirm your email address by clicking the link below:</p>
                <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;"><a href="http://localhost:4000/api/verify?email=${email}" style="color: #0073e6; text-decoration: none;">Verify Email Address</a></p>
                <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Verifying your email address ensures that you can receive important updates and information about your account. If you did not sign up for this account or believe you received this message in error, please disregard this email.</p>
                <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">For any questions or assistance, feel free to contact our support team at <a href="mailto:midknightv03@gmail.com" style="color: #0073e6; text-decoration: none;">midknightv03@gmail.com</a>.</p>
                <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Thank you for your cooperation.</p>
                <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Best regards,<br>Team Midknight</p>
                </div>
            `          
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ title: "Success", msg: 'Thank you for signing up! Please check your email for a verification message to complete the account activation.' });
        
      } catch (error) {
            console.error();
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
            const expires = Date.now() + 3600000;

            const mailOptions = {
                from: 'midknightv03@kajas.site',
                to: email,
                subject: 'Password Reset',
                html: `
                    <div style="margin-left: 23px; overflow: hidden; max-width: 100%; font-family: Arial, sans-serif;">
                    <h1 style="color: #4D493E; font-size: xx-large; margin: 0; margin-bottom: 8px;">Password Reset</h1>
                    <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">You requested a password reset.</p>
                    <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Click the link below to reset your password:</p>
                    <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;"><a href="http://localhost:4200/reset-password?token=${token}" style="color: #0073e6; text-decoration: none;">Reset Password</a></p>
                    <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">This link will expire in 1 hour.</p>
                    <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">If you did not request this password reset or believe this email was sent in error, please disregard it.</p>
                    <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">For any assistance, feel free to contact our support team at <a href="mailto:midknightv03@gmail.com" style="color: #0073e6; text-decoration: none;">midknightv03@gmail.com</a>.</p>
                    <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Thank you.</p>
                    <p style="color: #8E7C70; font-size: 16px; margin-bottom: 23px;">Best regards,<br>Team Midknight</p>
                    </div>
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

module.exports = { mailer,
    forgotPassword, 
    transporter
}