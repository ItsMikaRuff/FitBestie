// utils/captcha.js

const axios = require("axios");

const captcha = async (token) => {
    try {
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret,
                response: token,
            },
        });

        return response.data.success;
    } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        return false;
    }
};

module.exports = captcha;
