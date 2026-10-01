const { body, param } = require('express-validator');

function personValidator(prefix) {
  return [
    body(`${prefix}.fullName`)
      .trim()
      .notEmpty().withMessage(`${prefix} full name is required`)
      .isLength({ min: 2, max: 150 }),
    body(`${prefix}.dateOfBirth`)
      .notEmpty().withMessage(`${prefix} date of birth is required`)
      .isISO8601().withMessage(`${prefix} date of birth must be a valid date (YYYY-MM-DD)`)
      .custom((value) => new Date(value) <= new Date()).withMessage(`${prefix} date of birth cannot be in the future`),
    body(`${prefix}.timeOfBirth`)
      .notEmpty().withMessage(`${prefix} time of birth is required`)
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage(`${prefix} time of birth must be in HH:MM format`),
    body(`${prefix}.placeOfBirth`)
      .trim()
      .notEmpty().withMessage(`${prefix} place of birth is required`)
      .isLength({ min: 2, max: 255 }),
  ];
}

const createMatchValidator = [
  ...personValidator('groom'),
  ...personValidator('bride'),
];

const idParamValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid match id')];

module.exports = { createMatchValidator, idParamValidator };
