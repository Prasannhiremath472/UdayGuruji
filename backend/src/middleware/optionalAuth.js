const authService = require('../services/authService');

/**
 * Attaches req.user when a valid Bearer token is present, but never rejects
 * the request when it's absent or invalid - used on routes that are public
 * for customers (via access token) but also usable by logged-in admin/staff
 * without needing the access token.
 */
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = authService.verifyToken(header.slice('Bearer '.length));
      req.user = { id: payload.sub, role: payload.role, name: payload.name, email: payload.email };
    } catch (err) {
      // Invalid/expired token on an optional-auth route: proceed unauthenticated.
    }
  }
  next();
}

module.exports = optionalAuth;
