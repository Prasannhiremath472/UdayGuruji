const { query } = require('express-validator');

const panchangQueryValidator = [
  query('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date (YYYY-MM-DD)'),
  query('time')
    .optional({ values: 'falsy' })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:MM format'),
  query('place')
    .trim()
    .notEmpty().withMessage('Place is required')
    .isLength({ min: 2, max: 255 }).withMessage('Place must be between 2 and 255 characters'),
];

module.exports = { panchangQueryValidator };
