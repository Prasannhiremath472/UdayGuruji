const { body, param, query } = require('express-validator');

const createConsultationValidator = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 150 }),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Email must be valid'),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 30 }),
  body().custom((value) => {
    if (!value.email && !value.phone) {
      throw new Error('Provide at least an email or a phone number so we can respond');
    }
    return true;
  }),
  body('kundaliId').optional({ values: 'falsy' }).isInt({ min: 1 }),
  body('question')
    .trim()
    .notEmpty().withMessage('Question is required')
    .isLength({ min: 5, max: 2000 }).withMessage('Question must be between 5 and 2000 characters'),
];

const idParamValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid consultation id')];

const searchValidator = [
  query('status').optional({ values: 'falsy' }).isIn(['pending', 'answered', 'closed']),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

const replyValidator = [
  body('adminReply')
    .trim()
    .notEmpty().withMessage('Reply text is required')
    .isLength({ min: 2, max: 4000 }),
  body('status').optional().isIn(['pending', 'answered', 'closed']),
];

module.exports = { createConsultationValidator, idParamValidator, searchValidator, replyValidator };
