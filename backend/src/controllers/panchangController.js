const panchangService = require('../services/panchangService');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const getPanchang = asyncHandler(async (req, res) => {
  const { date, time, place } = req.query;
  const result = await panchangService.getPanchang({ date, time, place });
  return success(res, { message: 'Panchang retrieved successfully', data: result });
});

const getMuhurat = asyncHandler(async (req, res) => {
  const { date, time, place } = req.query;
  const result = await panchangService.getMuhurat({ date, time, place });
  return success(res, { message: 'Muhurat retrieved successfully', data: result });
});

module.exports = { getPanchang, getMuhurat };
