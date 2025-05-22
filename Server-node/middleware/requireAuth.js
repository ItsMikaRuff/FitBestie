const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
    const auth = req.headers.authorization;

    console.log("✅ requireAuth triggered");
    console.log("🪙 Extracted token:", auth?.split(' ')[1]);

    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const token = auth.split(' ')[1];
    try {
        console.log("🔍 Verifying token...");
        console.log("📦 JWT_SECRET from env:", process.env.JWT_SECRET);

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        console.log("✅ Token verified:", payload);
        next();
    } catch (err) {
        console.error("❌ Invalid token:", err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
