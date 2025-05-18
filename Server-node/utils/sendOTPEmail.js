// sendOTPEmail.js

const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: '"FitBestie" <mistwear@gmail.com>',
        to: email,
        subject: "קוד חד־פעמי להתחברות",
        html: `<p>הקוד שלך: <b>${otp}</b><br>הקוד בתוקף ל־5 דקות בלבד.</p>`,
    });
};

module.exports = sendOTPEmail;
