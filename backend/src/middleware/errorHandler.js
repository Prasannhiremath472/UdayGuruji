const logger = require('../utils/logger');
const env = require('../config/env');
const { error: sendError, ApiError } = require('../utils/apiResponse');

function notFoundHandler(req, res) {
  return sendError(res, { statusCode: 404, message: 'Route not found', errorCode: 'ROUTE_NOT_FOUND' });
}

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) logger.error(err.stack || err.message);
    return sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      errorCode: err.errorCode,
      details: err.details,
    });
  }

  logger.error(err.stack || err.message);

  return sendError(res, {
    statusCode: 500,
    message: env.nodeEnv === 'production' ? 'Something went wrong' : err.message,
    errorCode: 'INTERNAL_ERROR',
  });
}

module.exports = { notFoundHandler, errorHandler };
