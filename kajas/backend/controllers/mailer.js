const { log } = require('@angular-devkit/build-angular/src/builders/ssr-dev-server');
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

module.exports = { mailer }
