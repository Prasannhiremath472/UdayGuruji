const { getAstrologyProvider } = require('../providers/astrology');
const kundaliRepository = require('../repositories/kundaliRepository');
const { resolveBirthLocation } = require('./locationService');
const { calculateAshtakavarga, calculateDoshas, calculateYogas, calculateTransits } = require('./vedicCalculationService');
const geminiInterpretationService = require('./geminiInterpretationService');
const { ApiError } = require('../utils/apiResponse');

/**
 * Finds the Mahadasha (top-level Dasha) whose date range covers today, so
 * we generate an AI narrative only for the currently-running period
 * rather than all ~9 Mahadashas in the tree.
 */
function findCurrentMahadasha(dashaTree) {
  const today = new Date().toISOString().slice(0, 10);
  return (dashaTree || []).find((node) => node.startDate <= today && today <= node.endDate);
}

/**
 * Resolves a birth input (name-independent) through geocode -> timezone
 * -> astrology provider, returning the raw normalized astrology result
 * plus the resolved location. Shared by full kundali generation and by
 * gunaMilanService's matching flow, which needs each person's Moon
 * sign/Nakshatra without persisting a full kundali record for them.
 */
async function computeAstrologyResult({ dateOfBirth, timeOfBirth, placeOfBirth }) {
  const [year, month, date] = dateOfBirth.split('-').map(Number);
  const [hours, minutes] = timeOfBirth.split(':').map(Number);

  // Approximate UTC epoch seconds for the birth moment, used only as a
  // reference instant for the timezone lookup (historical DST/offset rules).
  const approxUtcSeconds = Math.floor(Date.UTC(year, month - 1, date, hours, minutes) / 1000);

  const location = await resolveBirthLocation(placeOfBirth, approxUtcSeconds);
  const utcOffsetHours = location.utcOffsetMinutes / 60;

  const astrologyProvider = getAstrologyProvider();
  const result = await astrologyProvider.generateKundali({
    year, month, date, hours, minutes, seconds: 0,
    latitude: location.latitude,
    longitude: location.longitude,
    utcOffsetHours,
  });

  return { location, result };
}

/**
 * Full kundali generation pipeline: geocode -> timezone -> astrology
 * provider -> persist. Throws ApiError on any stage failure.
 */
async function generateAndSaveKundali(input, createdBy = null, customerId = null) {
  const { location, result } = await computeAstrologyResult(input);

  // Yogas, Doshas, and Ashtakavarga are computed locally from the
  // planetary positions rather than from the astrology provider, since
  // Free Astrology API's free tier has no endpoints for them (confirmed
  // via docs + live testing). See vedicCalculationService.js.
  const doshas = calculateDoshas(result.planets);
  const yogas = calculateYogas(result.planets);
  const ashtakavarga = calculateAshtakavarga(result.planets, result.lagna);

  // AI interpretation text, generated from the real facts above. Each
  // call independently returns null on any failure (see safeGenerate in
  // geminiInterpretationService.js), so a Gemini outage never blocks
  // kundali generation - those report sections are simply omitted.
  const currentMahadasha = findCurrentMahadasha(result.vimshottariDasha);
  const [personalitySummary, dashaNarrative, yogaExplanations, doshaExplanations] = await Promise.all([
    geminiInterpretationService.generatePersonalitySummary({
      fullName: input.fullName,
      lagna: result.lagna,
      rashi: result.rashi,
      nakshatra: result.nakshatra,
      planets: result.planets,
    }),
    currentMahadasha
      ? geminiInterpretationService.generateDashaNarrative(currentMahadasha)
      : Promise.resolve(null),
    Promise.all(yogas.map((y) => geminiInterpretationService.generateYogaDoshaExplanation({
      name: y.name, mechanicalDescription: y.description, isDosha: false,
    }))),
    Promise.all(doshas.map((d) => geminiInterpretationService.generateYogaDoshaExplanation({
      name: d.name, mechanicalDescription: d.description, isDosha: true,
    }))),
  ]);

  yogas.forEach((y, i) => { y.aiExplanation = yogaExplanations[i]; });
  doshas.forEach((d, i) => { d.aiExplanation = doshaExplanations[i]; });
  if (currentMahadasha) currentMahadasha.aiNarrative = dashaNarrative;

  const { id: kundaliId, accessToken } = await kundaliRepository.saveFullKundali({
    fullName: input.fullName,
    gender: input.gender,
    dateOfBirth: input.dateOfBirth,
    timeOfBirth: input.timeOfBirth,
    placeOfBirth: input.placeOfBirth,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
    utcOffsetMinutes: location.utcOffsetMinutes,
    ayanamsa: 'Lahiri',
    languagePreference: input.languagePreference || 'en',
    lagna: result.lagna,
    rashi: result.rashi,
    nakshatra: result.nakshatra,
    nakshatraPada: result.nakshatraPada,
    personalitySummary,
    status: 'completed',
    rawResponse: result.raw,
    createdBy,
    customerId,
    planets: result.planets,
    divisionalCharts: result.divisionalCharts,
    vimshottariDasha: result.vimshottariDasha,
    yogas,
    doshas,
    ashtakavarga,
  });

  const kundali = await kundaliRepository.findById(kundaliId);
  return { ...kundali, accessToken };
}

/**
 * Public (unauthenticated) access requires the unguessable access token
 * issued at creation time, so kundali IDs cannot be enumerated to read
 * other customers' birth data. Admin/staff (authenticated) bypass this
 * check since their access is already gated by login + role.
 */
async function getKundaliById(id, { accessToken, isAuthenticated = false } = {}) {
  if (!isAuthenticated) {
    const actualToken = await kundaliRepository.fetchAccessTokenById(id);
    if (!actualToken || actualToken !== accessToken) {
      throw new ApiError(404, 'Kundali not found', 'KUNDALI_NOT_FOUND');
    }
  }

  const kundali = await kundaliRepository.findById(id);
  if (!kundali) {
    throw new ApiError(404, 'Kundali not found', 'KUNDALI_NOT_FOUND');
  }
  return kundali;
}

async function searchKundalis(params) {
  return kundaliRepository.search(params);
}

async function deleteKundali(id) {
  const deleted = await kundaliRepository.deleteById(id);
  if (!deleted) {
    throw new ApiError(404, 'Kundali not found', 'KUNDALI_NOT_FOUND');
  }
}

/**
 * Computes current (Gochar) planetary transits relative to a saved
 * kundali's natal Lagna. Access is gated the same way as viewing the
 * kundali itself (access token for public, auth bypass for admin/staff).
 */
async function getTransitsForKundali(id, { accessToken, isAuthenticated = false } = {}) {
  const kundali = await getKundaliById(id, { accessToken, isAuthenticated });

  // Planetary sign placements change slowly enough (days to years,
  // depending on the planet) that using the current UTC instant as a
  // stand-in for "now, local to the birthplace" introduces at most a
  // same-day rounding difference - acceptable for a transit overview.
  const now = new Date();
  const { result: currentAstrology } = await computeAstrologyResult({
    dateOfBirth: now.toISOString().slice(0, 10),
    timeOfBirth: `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`,
    placeOfBirth: kundali.place_of_birth,
  });

  const transits = calculateTransits(currentAstrology.planets, kundali.lagna);
  const narrative = await geminiInterpretationService.generateTransitNarrative(transits);
  return { kundaliId: kundali.id, lagna: kundali.lagna, generatedAt: now.toISOString(), transits, narrative };
}

async function getMyKundalis(customerId) {
  return kundaliRepository.findByCustomerId(customerId);
}

module.exports = {
  generateAndSaveKundali,
  getKundaliById,
  searchKundalis,
  deleteKundali,
  computeAstrologyResult,
  getTransitsForKundali,
  getMyKundalis,
};
