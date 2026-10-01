const authService = require('../services/authService');
const { ApiError } = require('../utils/apiResponse');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required', 'AUTH_REQUIRED'));
  }
  const token = header.slice('Bearer '.length);
  const payload = authService.verifyToken(token);
  req.user = { id: payload.sub, role: payload.role, name: payload.name, email: payload.email };
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action', 'FORBIDDEN'));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
