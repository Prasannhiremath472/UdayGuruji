const express = require('express');
const numerologyController = require('../../controllers/numerologyController');
const { numerologyValidator } = require('../../validators/numerologyValidator');
const validate = require('../../middleware/validate');
const { kundaliGenerationLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/', kundaliGenerationLimiter, numerologyValidator, validate, numerologyController.calculate);

module.exports = router;
