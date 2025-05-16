function authorizeRoles(...roles) {
    return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};
}

// Middleware para verificar si está autenticado
function isAuthenticated(req, res, next) {
    if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
}
    next();
}

module.exports = { authorizeRoles, isAuthenticated };