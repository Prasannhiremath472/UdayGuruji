const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return success(res, { message: 'Login successful', data: result });
});

const me = asyncHandler(async (req, res) => {
  return success(res, { message: 'Current user', data: req.user });
});

module.exports = { login, me };
