const express = require('express');
const brandController = require('../../controllers/brandController');
const { updateBrandValidator } = require('../../validators/brandValidator');
const validate = require('../../middleware/validate');
const { requireAuth, requireRole } = require('../../middleware/authMiddleware');
const { logoUpload } = require('../../config/upload');

const router = express.Router();

router.get('/', brandController.getSettings);
router.put('/', requireAuth, requireRole('admin'), updateBrandValidator, validate, brandController.updateSettings);
router.post('/logo', requireAuth, requireRole('admin'), logoUpload.single('logo'), brandController.uploadLogo);

module.exports = router;
