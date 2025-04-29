const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const token = auth.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;  // למשל { id: '...', role: 'worker' }
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
