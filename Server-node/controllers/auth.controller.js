const User = require('../models/user.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'משתמש לא נמצא' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // שעה
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: '"FitBestie" <no-reply@fitbestie.com>',
      to: user.email,
      subject: 'איפוס סיסמה',
      html: `<p>לחצי על הקישור לאיפוס הסיסמה:</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ message: 'קישור לאיפוס סיסמה נשלח למייל' });

  } catch (err) {
    console.error('שגיאה בשליחת מייל איפוס:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};
