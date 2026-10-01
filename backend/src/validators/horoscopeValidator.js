const { param, query } = require('express-validator');
const { RASHIS } = require('../constants/horoscopeTemplates');

const horoscopeValidator = [
  param('rashi').isIn(RASHIS).withMessage(`Rashi must be one of: ${RASHIS.join(', ')}`),
  query('period').optional().isIn(['daily', 'weekly', 'monthly']).withMessage('Period must be daily, weekly, or monthly'),
];

module.exports = { horoscopeValidator };
