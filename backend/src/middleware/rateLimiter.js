const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const kundaliGenerationLimiter = rateLimit({
  windowMs: env.rateLimit.kundaliWindowMinutes * 60 * 1000,
  max: env.rateLimit.kundaliMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many kundali generation requests. Please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
});

const authLimiter = rateLimit({
  windowMs: env.rateLimit.authWindowMinutes * 60 * 1000,
  max: env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
});

module.exports = { kundaliGenerationLimiter, authLimiter };
