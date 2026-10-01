const brandRepository = require('../repositories/brandRepository');
const asyncHandler = require('../utils/asyncHandler');
const { success, ApiError } = require('../utils/apiResponse');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await brandRepository.get();
  return success(res, { message: 'Brand settings retrieved successfully', data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { siteName, primaryColor, contactEmail, contactPhone, footerText } = req.body;
  const updated = await brandRepository.update({ siteName, primaryColor, contactEmail, contactPhone, footerText });
  await brandRepository.insertAuditLog({
    userId: req.user.id,
    action: 'UPDATE_BRAND_SETTINGS',
    entityType: 'brand_settings',
    entityId: 1,
    ipAddress: req.ip,
  });
  return success(res, { message: 'Brand settings updated successfully', data: updated });
});

const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No logo file was uploaded', 'LOGO_FILE_REQUIRED');
  }
  const logoUrl = `/uploads/logos/${req.file.filename}`;
  const updated = await brandRepository.update({ logoUrl });
  await brandRepository.insertAuditLog({
    userId: req.user.id,
    action: 'UPDATE_BRAND_LOGO',
    entityType: 'brand_settings',
    entityId: 1,
    ipAddress: req.ip,
  });
  return success(res, { message: 'Logo uploaded successfully', data: updated });
});

module.exports = { getSettings, updateSettings, uploadLogo };
