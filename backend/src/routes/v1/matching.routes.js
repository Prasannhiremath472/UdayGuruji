const express = require('express');
const matchingController = require('../../controllers/matchingController');
const { createMatchValidator, idParamValidator } = require('../../validators/matchingValidator');
const validate = require('../../middleware/validate');
const optionalAuth = require('../../middleware/optionalAuth');
const { kundaliGenerationLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/', kundaliGenerationLimiter, optionalAuth, createMatchValidator, validate, matchingController.create);
router.get('/:id', optionalAuth, idParamValidator, validate, matchingController.getById);

module.exports = router;
