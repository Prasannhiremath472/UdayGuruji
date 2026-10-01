const express = require('express');
const consultationController = require('../../controllers/consultationController');
const {
  createConsultationValidator, idParamValidator, searchValidator, replyValidator,
} = require('../../validators/consultationValidator');
const validate = require('../../middleware/validate');
const { requireAuth, requireRole } = require('../../middleware/authMiddleware');
const { kundaliGenerationLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/', kundaliGenerationLimiter, createConsultationValidator, validate, consultationController.create);
router.get('/', requireAuth, requireRole('admin', 'staff'), searchValidator, validate, consultationController.search);
router.get('/:id', requireAuth, requireRole('admin', 'staff'), idParamValidator, validate, consultationController.getById);
router.patch('/:id', requireAuth, requireRole('admin', 'staff'), idParamValidator, replyValidator, validate, consultationController.reply);

module.exports = router;
