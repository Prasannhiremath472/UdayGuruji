const consultationService = require('../services/consultationService');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const create = asyncHandler(async (req, res) => {
  const consultation = await consultationService.submitQuestion(req.body);
  return success(res, { statusCode: 201, message: 'Your question has been submitted', data: consultation });
});

const getById = asyncHandler(async (req, res) => {
  const consultation = await consultationService.getById(req.params.id);
  return success(res, { message: 'Consultation retrieved successfully', data: consultation });
});

const search = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const { rows, total } = await consultationService.search({ status, page, limit });
  return success(res, {
    message: 'Consultations retrieved successfully',
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

const reply = asyncHandler(async (req, res) => {
  const { adminReply, status } = req.body;
  const consultation = await consultationService.replyToConsultation(req.params.id, {
    adminReply,
    status,
    repliedBy: req.user.id,
  });
  return success(res, { message: 'Reply saved successfully', data: consultation });
});

module.exports = { create, getById, search, reply };
