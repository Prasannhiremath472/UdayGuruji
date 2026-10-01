const express = require('express');
const authController = require('../../controllers/authController');
const { loginValidator } = require('../../validators/authValidator');
const validate = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/authMiddleware');
const { authLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.get('/me', requireAuth, authController.me);

module.exports = router;
