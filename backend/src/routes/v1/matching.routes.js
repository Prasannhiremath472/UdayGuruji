const express = require('express');
const matchingController = require('../../controllers/matchingController');
const { createMatchValidator, idParamValidator } = require('../../validators/matchingValidator');
const validate = require('../../middleware/validate');
const optionalAuth = require('../../middleware/optionalAuth');
const { requireCustomerAuth, optionalCustomerAuth } = require('../../middleware/customerAuthMiddleware');
const { kundaliGenerationLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/', kundaliGenerationLimiter, optionalAuth, optionalCustomerAuth, createMatchValidator, validate, matchingController.create);
router.get('/mine', requireCustomerAuth, matchingController.getMine);
router.get('/:id', optionalAuth, idParamValidator, validate, matchingController.getById);

module.exports = router;
