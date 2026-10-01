const horoscopeService = require('../services/horoscopeService');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const getHoroscope = asyncHandler(async (req, res) => {
  const { rashi } = req.params;
  const { period = 'daily' } = req.query;
  const result = horoscopeService.getHoroscope(rashi, period);
  return success(res, { message: 'Horoscope retrieved successfully', data: result });
});

const listRashis = asyncHandler(async (req, res) => {
  const rashis = horoscopeService.getAllRashis();
  return success(res, { message: 'Rashis retrieved successfully', data: rashis });
});

module.exports = { getHoroscope, listRashis };
