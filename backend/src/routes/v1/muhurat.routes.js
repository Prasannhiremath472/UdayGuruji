const express = require('express');
const panchangController = require('../../controllers/panchangController');
const { panchangQueryValidator } = require('../../validators/panchangValidator');
const validate = require('../../middleware/validate');
const { kundaliGenerationLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.get('/', kundaliGenerationLimiter, panchangQueryValidator, validate, panchangController.getMuhurat);

module.exports = router;
