const kundaliService = require('../services/kundaliService');
const pdfService = require('../services/pdfService');
const brandRepository = require('../repositories/brandRepository');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const create = asyncHandler(async (req, res) => {
  const createdBy = req.user ? req.user.id : null;
  const kundali = await kundaliService.generateAndSaveKundali(req.body, createdBy);
  return success(res, { statusCode: 201, message: 'Kundali generated successfully', data: kundali });
});

const getById = asyncHandler(async (req, res) => {
  const kundali = await kundaliService.getKundaliById(req.params.id, {
    accessToken: req.query.accessToken,
    isAuthenticated: Boolean(req.user),
  });
  return success(res, { message: 'Kundali retrieved successfully', data: kundali });
});

const search = asyncHandler(async (req, res) => {
  const { query, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
  const { rows, total } = await kundaliService.searchKundalis({ query, dateFrom, dateTo, page, limit });
  return success(res, {
    message: 'Kundalis retrieved successfully',
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

const remove = asyncHandler(async (req, res) => {
  await kundaliService.deleteKundali(req.params.id);
  if (req.user) {
    await brandRepository.insertAuditLog({
      userId: req.user.id,
      action: 'DELETE_KUNDALI',
      entityType: 'kundali',
      entityId: req.params.id,
      ipAddress: req.ip,
    });
  }
  return success(res, { message: 'Kundali deleted successfully', data: null });
});

const downloadPdf = asyncHandler(async (req, res) => {
  const kundali = await kundaliService.getKundaliById(req.params.id, {
    accessToken: req.query.accessToken,
    isAuthenticated: Boolean(req.user),
  });
  const reportUrl = `${env.frontendBaseUrl}/report/${kundali.id}/print?accessToken=${encodeURIComponent(req.query.accessToken || '')}`;
  const pdfBuffer = await pdfService.renderReportPdf(reportUrl);

  if (req.user) {
    await brandRepository.insertAuditLog({
      userId: req.user.id,
      action: 'DOWNLOAD_PDF',
      entityType: 'kundali',
      entityId: kundali.id,
      ipAddress: req.ip,
    });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="kundali-${kundali.id}.pdf"`);
  return res.send(pdfBuffer);
});

const getTransits = asyncHandler(async (req, res) => {
  const transits = await kundaliService.getTransitsForKundali(req.params.id, {
    accessToken: req.query.accessToken,
    isAuthenticated: Boolean(req.user),
  });
  return success(res, { message: 'Transits retrieved successfully', data: transits });
});

module.exports = { create, getById, search, remove, downloadPdf, getTransits };
