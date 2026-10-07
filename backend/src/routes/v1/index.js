const express = require('express');
const kundaliRoutes = require('./kundali.routes');
const authRoutes = require('./auth.routes');
const brandRoutes = require('./brand.routes');
const panchangRoutes = require('./panchang.routes');
const muhuratRoutes = require('./muhurat.routes');
const numerologyRoutes = require('./numerology.routes');
const horoscopeRoutes = require('./horoscope.routes');
const matchingRoutes = require('./matching.routes');
const consultationRoutes = require('./consultation.routes');
const customerAuthRoutes = require('./customerAuth.routes');

const router = express.Router();

router.use('/kundalis', kundaliRoutes);
router.use('/auth', authRoutes);
router.use('/account', customerAuthRoutes);
router.use('/brand', brandRoutes);
router.use('/panchang', panchangRoutes);
router.use('/muhurat', muhuratRoutes);
router.use('/numerology', numerologyRoutes);
router.use('/horoscope', horoscopeRoutes);
router.use('/matching', matchingRoutes);
router.use('/consultations', consultationRoutes);

module.exports = router;
