const matchingService = require('../services/matchingService');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const create = asyncHandler(async (req, res) => {
  const createdBy = req.user ? req.user.id : null;
  const match = await matchingService.generateMatch(req.body, createdBy);
  return success(res, { statusCode: 201, message: 'Kundali match generated successfully', data: match });
});

const getById = asyncHandler(async (req, res) => {
  const match = await matchingService.getMatchById(req.params.id, {
    accessToken: req.query.accessToken,
    isAuthenticated: Boolean(req.user),
  });
  return success(res, { message: 'Match retrieved successfully', data: match });
});

module.exports = { create, getById };
