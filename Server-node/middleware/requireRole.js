//requireRole.js

module.exports = function requireRole(allowedRoles) {
    return (req, res, next) => {
        console.log(req.user);
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }
        
        next();
    };
};