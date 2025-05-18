const nodemailer = require("nodemailer");

const sendOTPEmail = async (recipientEmail, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILGUN_HOST,
            port: process.env.MAILGUN_PORT,
            auth: {
                user: process.env.MAILGUN_USER,
                pass: process.env.MAILGUN_PASS,
            },
        });

        await transporter.sendMail({
            from: `"FitBestie" <${process.env.MAILGUN_USER}>`,
            to: recipientEmail,
            subject: "קוד חד־פעמי להתחברות",
            html: `<p>הקוד שלך: <b>${otp}</b><br>הקוד בתוקף ל־5 דקות בלבד.</p>`,
        });

        console.log("📧 OTP email sent via Mailgun (fitbestie.com)!");
    } catch (error) {
        console.error("❌ Failed to send OTP via Mailgun:", error);
    }
};

module.exports = sendOTPEmail;
