const { body, param, query } = require('express-validator');

const createKundaliValidator = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 150 }).withMessage('Full name must be between 2 and 150 characters'),
  body('gender')
    .optional({ values: 'falsy' })
    .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('dateOfBirth')
    .notEmpty().withMessage('Date of birth is required')
    .isISO8601().withMessage('Date of birth must be a valid date (YYYY-MM-DD)')
    .custom((value) => new Date(value) <= new Date()).withMessage('Date of birth cannot be in the future'),
  body('timeOfBirth')
    .notEmpty().withMessage('Time of birth is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).withMessage('Time of birth must be in HH:MM format'),
  body('placeOfBirth')
    .trim()
    .notEmpty().withMessage('Place of birth is required')
    .isLength({ min: 2, max: 255 }).withMessage('Place of birth must be between 2 and 255 characters'),
  body('languagePreference')
    .optional({ values: 'falsy' })
    .isIn(['en', 'hi', 'mr']).withMessage('Unsupported language preference'),
];

const idParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('Invalid kundali id'),
];

const searchValidator = [
  query('query').optional().trim().isLength({ max: 255 }),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

module.exports = { createKundaliValidator, idParamValidator, searchValidator };
