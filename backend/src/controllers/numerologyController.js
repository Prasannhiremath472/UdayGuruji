const numerologyService = require('../services/numerologyService');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const calculate = asyncHandler(async (req, res) => {
  const { fullName, dateOfBirth } = req.body;
  const result = numerologyService.calculateNumerology({ fullName, dateOfBirth });
  return success(res, { message: 'Numerology calculated successfully', data: result });
});

module.exports = { calculate };
