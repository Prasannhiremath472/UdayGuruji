const { body } = require('express-validator');

const signupValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 150 }).withMessage('Name must be between 2 and 150 characters'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 30 }).withMessage('Phone must be at most 30 characters'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { signupValidator, loginValidator };
