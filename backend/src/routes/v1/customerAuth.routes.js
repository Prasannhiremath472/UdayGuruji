const express = require('express');
const customerAuthController = require('../../controllers/customerAuthController');
const { signupValidator, loginValidator } = require('../../validators/customerAuthValidator');
const validate = require('../../middleware/validate');
const { requireCustomerAuth } = require('../../middleware/customerAuthMiddleware');
const { authLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/signup', authLimiter, signupValidator, validate, customerAuthController.signup);
router.post('/login', authLimiter, loginValidator, validate, customerAuthController.login);
router.get('/me', requireCustomerAuth, customerAuthController.me);

module.exports = router;
