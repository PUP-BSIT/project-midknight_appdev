const { log } = require('@angular-devkit/build-angular/src/builders/ssr-dev-server');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
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

const mailer = async (req, res) => {
    try {
        const { email } = req.body;
        const mailOptions = {
            from: 'midknightv03@kajas.site',
            to: email,
            subject: 'Email Verification',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Email Verification</title>
                    <style>${emailStyles}</style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">
                            <img src="cid:logo.png" alt="Logo">
                        </div>
                        <div class="content">
                            <h1>Email Verification</h1>
                            <p>We hope this email finds you well.</p>
                            <p>To complete your registration and activate your
                                account, we need to verify your email address. 
                                Please take a moment to confirm your email address 
                                by clicking the link below:</p>
                            <button><a class="button"
                                href="http://localhost:4000/api/verify?email=${email}">
                                    Verify Email Address</a></button>
                            <p>Verifying your email address ensures that you can
                                receive important updates and information about 
                                your account. If you did not sign up for this 
                                account or believe you received this message in 
                                error, please disregard this email.</p>
                            <p>For any questions or assistance, feel free to 
                                contact our support team at 
                            <a class="mail" href="mailto:midknightv03@gmail.com">
                                midknightv03@gmail.com</a>.</p>
                            <p>Thank you for your cooperation.</p>
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
        return res.status(200).json({ title: "Success", msg: 'Thank you for signing up! Please check your email for a verification message to complete the account activation.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ title: "Internal Error", msg: "Something went wrong! Please try again later." });
    }
};

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
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Password Reset</title>
                        <style>${emailStyles}</style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="logo">
                                <img src="cid:logo.png" alt="Logo">
                            </div>
                            <div class="content">
                                <h1>Password Reset</h1>
                                <p>You requested a password reset.</p>
                                <p>Click the link below to reset your password:</p>
                                <button><a class="button"
                                    href="http://localhost:4200/reset-password?token=${token}">
                                        Reset Password</a></button>
                                <p>This link will expire in 1 hour.</p>
                                <p>If you did not request this password reset or
                                    believe this email was sent in error, 
                                    please disregard it.</p>
                                <p>For any assistance, feel free to contact our 
                                    support team at 
                                <a class="mail" href="mailto:midknightv03@gmail.com">
                                    midknightv03@gmail.com</a>.</p>
                                <p>Thank you.</p>
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