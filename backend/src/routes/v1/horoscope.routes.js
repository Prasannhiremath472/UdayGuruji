const express = require('express');
const horoscopeController = require('../../controllers/horoscopeController');
const { horoscopeValidator } = require('../../validators/horoscopeValidator');
const validate = require('../../middleware/validate');

const router = express.Router();

router.get('/', horoscopeController.listRashis);
router.get('/:rashi', horoscopeValidator, validate, horoscopeController.getHoroscope);

module.exports = router;
