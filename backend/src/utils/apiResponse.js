function success(res, { message = 'Success', data = null, statusCode = 200, pagination = null }) {
  const body = { success: true, message, data };
  if (pagination) body.pagination = pagination;
  return res.status(statusCode).json(body);
}

function error(res, { message = 'Something went wrong', statusCode = 500, errorCode = 'INTERNAL_ERROR', details = undefined }) {
  const body = { success: false, message, errorCode };
  if (details !== undefined) body.details = details;
  return res.status(statusCode).json(body);
}

class ApiError extends Error {
  constructor(statusCode, message, errorCode = 'ERROR', details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

module.exports = { success, error, ApiError };
