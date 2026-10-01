const { body } = require('express-validator');

const updateBrandValidator = [
  body('siteName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 150 }),
  body('primaryColor').optional({ values: 'falsy' }).matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Primary color must be a hex value like #7A2E2E'),
  body('contactEmail').optional({ values: 'falsy' }).isEmail().withMessage('Contact email must be valid'),
  body('contactPhone').optional({ values: 'falsy' }).trim().isLength({ max: 30 }),
  body('footerText').optional({ values: 'falsy' }).trim().isLength({ max: 500 }),
];

module.exports = { updateBrandValidator };
