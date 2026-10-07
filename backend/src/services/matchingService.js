const kundaliService = require('./kundaliService');
const { calculateGunaMilan } = require('./gunaMilanService');
const matchRepository = require('../repositories/matchRepository');
const { ApiError } = require('../utils/apiResponse');

async function generateMatch({ groom, bride }, createdBy = null, customerId = null) {
  const [groomAstrology, brideAstrology] = await Promise.all([
    kundaliService.computeAstrologyResult(groom),
    kundaliService.computeAstrologyResult(bride),
  ]);

  const gunaMilan = calculateGunaMilan(
    { moonSign: groomAstrology.result.rashi, nakshatra: groomAstrology.result.nakshatra },
    { moonSign: brideAstrology.result.rashi, nakshatra: brideAstrology.result.nakshatra }
  );

  const { id, accessToken } = await matchRepository.create({
    groom: { name: groom.fullName, dateOfBirth: groom.dateOfBirth, timeOfBirth: groom.timeOfBirth, placeOfBirth: groom.placeOfBirth, moonSign: groomAstrology.result.rashi, nakshatra: groomAstrology.result.nakshatra },
    bride: { name: bride.fullName, dateOfBirth: bride.dateOfBirth, timeOfBirth: bride.timeOfBirth, placeOfBirth: bride.placeOfBirth, moonSign: brideAstrology.result.rashi, nakshatra: brideAstrology.result.nakshatra },
    totalScore: gunaMilan.totalScore,
    maxScore: gunaMilan.maxScore,
    verdict: gunaMilan.verdict,
    kootas: gunaMilan.kootas,
    createdBy,
    customerId,
  });

  const match = await matchRepository.findById(id);
  return { ...match, accessToken, hasNadiDosha: gunaMilan.hasNadiDosha, hasBhakootDosha: gunaMilan.hasBhakootDosha };
}

async function getMatchById(id, { accessToken, isAuthenticated = false } = {}) {
  if (!isAuthenticated) {
    const actualToken = await matchRepository.fetchAccessTokenById(id);
    if (!actualToken || actualToken !== accessToken) {
      throw new ApiError(404, 'Match not found', 'MATCH_NOT_FOUND');
    }
  }

  const match = await matchRepository.findById(id);
  if (!match) {
    throw new ApiError(404, 'Match not found', 'MATCH_NOT_FOUND');
  }
  return match;
}

async function getMyMatches(customerId) {
  return matchRepository.findByCustomerId(customerId);
}

module.exports = { generateMatch, getMatchById, getMyMatches };
