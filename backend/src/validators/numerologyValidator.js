const { body } = require('express-validator');

const numerologyValidator = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 150 }).withMessage('Full name must be between 2 and 150 characters')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Full name must contain only letters'),
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Date of birth must be a valid date (YYYY-MM-DD)')
    .custom((value) => new Date(value) <= new Date()).withMessage('Date of birth cannot be in the future'),
];

module.exports = { numerologyValidator };
