const { validationResult } = require('express-validator');
const { error: sendError } = require('../utils/apiResponse');

function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return sendError(res, {
      statusCode: 422,
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      details: result.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = validate;
