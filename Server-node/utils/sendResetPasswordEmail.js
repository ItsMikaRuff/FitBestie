// sendResetPasswordEmail.js (using Mailgun)

const nodemailer = require("nodemailer");
require("dotenv").config();
const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_HOST, // למשל: smtp.eu.mailgun.org
    port: process.env.MAILGUN_PORT, // למשל: 587
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILGUN_USER, // לדוגמה: postmaster@yourdomain.com
      pass: process.env.MAILGUN_PASS, // הסיסמה או האפ-קי של Mailgun
    },
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `FitBestie <${process.env.MAILGUN_USER}>`,
    to: email,
    subject: "איפוס סיסמה - FitBestie",
    html: `
      <h2>קיבלת בקשה לאיפוס סיסמה</h2>
      <p>לחצי על הקישור כדי לאפס את הסיסמה שלך:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>אם לא את ביקשת איפוס, ניתן להתעלם מההודעה</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = sendResetPasswordEmail;
