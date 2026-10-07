const customerAuthService = require('../services/customerAuthService');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const signup = asyncHandler(async (req, res) => {
  const result = await customerAuthService.signup(req.body);
  return success(res, { statusCode: 201, message: 'Account created', data: result });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await customerAuthService.login(email, password);
  return success(res, { message: 'Login successful', data: result });
});

const me = asyncHandler(async (req, res) => {
  return success(res, { message: 'Current customer', data: req.customer });
});

module.exports = { signup, login, me };
