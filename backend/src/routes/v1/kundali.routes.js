const express = require('express');
const kundaliController = require('../../controllers/kundaliController');
const { createKundaliValidator, idParamValidator, searchValidator } = require('../../validators/kundaliValidator');
const validate = require('../../middleware/validate');
const { requireAuth, requireRole } = require('../../middleware/authMiddleware');
const optionalAuth = require('../../middleware/optionalAuth');
const { kundaliGenerationLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/', kundaliGenerationLimiter, optionalAuth, createKundaliValidator, validate, kundaliController.create);
router.get('/', requireAuth, requireRole('admin', 'staff'), searchValidator, validate, kundaliController.search);
router.get('/:id', optionalAuth, idParamValidator, validate, kundaliController.getById);
router.get('/:id/pdf', optionalAuth, idParamValidator, validate, kundaliController.downloadPdf);
router.get('/:id/transits', kundaliGenerationLimiter, optionalAuth, idParamValidator, validate, kundaliController.getTransits);
router.delete('/:id', requireAuth, requireRole('admin'), idParamValidator, validate, kundaliController.remove);

module.exports = router;
