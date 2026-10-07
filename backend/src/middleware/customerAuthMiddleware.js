const customerAuthService = require('../services/customerAuthService');
const { ApiError } = require('../utils/apiResponse');

function requireCustomerAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Please log in to continue', 'CUSTOMER_AUTH_REQUIRED'));
  }
  const token = header.slice('Bearer '.length);
  const payload = customerAuthService.verifyToken(token);
  req.customer = { id: payload.sub, name: payload.name, email: payload.email };
  next();
}

/**
 * Attaches req.customer when a valid customer Bearer token is present, but
 * never rejects the request when it's absent or invalid - used on routes
 * that remain usable anonymously (e.g. generating a kundali as a guest) but
 * should link the record to the customer's account when they're logged in.
 */
function optionalCustomerAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = customerAuthService.verifyToken(header.slice('Bearer '.length));
      req.customer = { id: payload.sub, name: payload.name, email: payload.email };
    } catch (err) {
      // Invalid/expired token on an optional-auth route: proceed unauthenticated.
    }
  }
  next();
}

module.exports = { requireCustomerAuth, optionalCustomerAuth };
