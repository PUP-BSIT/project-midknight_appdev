const bcrypt = require('bcryptjs');
const User = require('../models/User');

const resetPassword = (req, res) => {
    const { token, newPassword, confirmNewPassword } = req.body;

    if (!token || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    User.findUserByResetToken(token)
        .then(user => {
            if (!user) {
                throw new Error('Invalid or expired token');
            }

            if (user.reset_token_expires < Date.now()) {
                throw new Error('Token has expired');
            }

            return bcrypt.hash(newPassword, 10)
                .then(hashedPassword => User.updatePassword(user.email, hashedPassword))
                .then(() => res.status(200).json({ message: 'Password has been reset' }));
        })
        .catch(error => {
            console.error('Error resetting password:', error);
            res.status(400).json({ message: error.message });
        });
};

module.exports = { resetPassword };
