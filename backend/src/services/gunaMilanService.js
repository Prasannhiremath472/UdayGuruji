const {
  ZODIAC_SIGNS, NAKSHATRAS, NAKSHATRA_GANA, NAKSHATRA_LORDS, SIGN_VARNA, SIGN_VASHYA,
  NAKSHATRA_YONI, PLANET_FRIENDSHIP, YONI_ENEMIES, YONI_FRIENDS,
} = require('../constants/gunaMilanTables');

function nakIndex(name) {
  return NAKSHATRAS.indexOf(name);
}

/**
 * Varna Koota (max 1): spiritual/work compatibility by Moon sign's Varna
 * class. Full point if bride's varna <= groom's varna in the hierarchy
 * (Brahmin > Kshatriya > Vaishya > Shudra), else 0.
 */
function varnaKoota(groomSignIdx, brideSignIdx) {
  const groomVarna = SIGN_VARNA[groomSignIdx];
  const brideVarna = SIGN_VARNA[brideSignIdx];
  const score = brideVarna <= groomVarna ? 1 : 0;
  return { name: 'Varna', maxScore: 1, score, description: 'Spiritual and work compatibility.' };
}

/**
 * Vashya Koota (max 2): mutual control/attraction by sign group.
 * Simplified standard scoring: same group = 2, otherwise a partial score
 * based on known compatible group pairs, else 0.
 */
function vashyaKoota(groomSignIdx, brideSignIdx) {
  const groomGroup = SIGN_VASHYA[groomSignIdx];
  const brideGroup = SIGN_VASHYA[brideSignIdx];
  let score = 0;
  if (groomGroup === brideGroup) score = 2;
  else if (
    (groomGroup === 'manav' && brideGroup === 'chatushpada') ||
    (brideGroup === 'manav' && groomGroup === 'chatushpada')
  ) score = 1;
  else score = 0.5;
  return { name: 'Vashya', maxScore: 2, score, description: 'Mutual control and attraction in the relationship.' };
}

/**
 * Tara Koota (max 3): counted distance between the two Nakshatras in
 * groups of 9, mapped to a 1-9 Tara number; certain Taras are favorable.
 */
function taraKoota(groomNakIdx, brideNakIdx) {
  const countForward = (from, to) => (((to - from + 27) % 27) + 1);
  const taraFrom = (count) => ((count - 1) % 9) + 1;

  const groomToBride = taraFrom(countForward(groomNakIdx, brideNakIdx));
  const brideToGroom = taraFrom(countForward(brideNakIdx, groomNakIdx));

  const unfavorableTaras = new Set([3, 5, 7]);
  const bothFavorable = !unfavorableTaras.has(groomToBride) && !unfavorableTaras.has(brideToGroom);
  const oneFavorable = !unfavorableTaras.has(groomToBride) || !unfavorableTaras.has(brideToGroom);

  const score = bothFavorable ? 3 : oneFavorable ? 1.5 : 0;
  return { name: 'Tara', maxScore: 3, score, description: 'Birth-star compatibility and general wellbeing.' };
}

/**
 * Yoni Koota (max 4): animal-symbol compatibility per Nakshatra.
 */
function yoniKoota(groomNakIdx, brideNakIdx) {
  const groomYoni = NAKSHATRA_YONI[groomNakIdx];
  const brideYoni = NAKSHATRA_YONI[brideNakIdx];

  const isPair = (list, a, b) => list.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

  let score = 2; // neutral default
  if (groomYoni === brideYoni) score = 4;
  else if (isPair(YONI_FRIENDS, groomYoni, brideYoni)) score = 3;
  else if (isPair(YONI_ENEMIES, groomYoni, brideYoni)) score = 0;

  return { name: 'Yoni', maxScore: 4, score, description: 'Sexual and physical compatibility.' };
}

/**
 * Graha Maitri Koota (max 5): friendship between the two Moon-sign lords.
 */
function grahaMaitriKoota(groomNakIdx, brideNakIdx) {
  const groomLord = NAKSHATRA_LORDS[groomNakIdx];
  const brideLord = NAKSHATRA_LORDS[brideNakIdx];

  const relation = (a, b) => {
    if (!PLANET_FRIENDSHIP[a] || !PLANET_FRIENDSHIP[a][b]) return 'neutral';
    return PLANET_FRIENDSHIP[a][b];
  };

  const groomToBride = relation(groomLord, brideLord);
  const brideToGroom = relation(brideLord, groomLord);

  let score;
  if (groomLord === brideLord) score = 5;
  else if (groomToBride === 'friend' && brideToGroom === 'friend') score = 5;
  else if (groomToBride === 'enemy' && brideToGroom === 'enemy') score = 0;
  else if (groomToBride === 'friend' || brideToGroom === 'friend') score = 4;
  else if (groomToBride === 'enemy' || brideToGroom === 'enemy') score = 1;
  else score = 3; // both neutral

  return { name: 'Graha Maitri', maxScore: 5, score, description: 'Mental compatibility and intellectual rapport.' };
}

/**
 * Gana Koota (max 6): temperament group (Deva/Manushya/Rakshasa).
 */
function ganaKoota(groomNakIdx, brideNakIdx) {
  const groomGana = NAKSHATRA_GANA[groomNakIdx];
  const brideGana = NAKSHATRA_GANA[brideNakIdx];

  let score;
  if (groomGana === brideGana) score = 6;
  else if ((groomGana === 1 && brideGana === 2) || (groomGana === 2 && brideGana === 1)) score = 6;
  else if ((groomGana === 2 && brideGana === 3) || (groomGana === 3 && brideGana === 2)) score = 1;
  else if (groomGana === 1 && brideGana === 3) score = 0;
  else if (groomGana === 3 && brideGana === 1) score = 3;
  else score = 3;

  return { name: 'Gana', maxScore: 6, score, description: 'Temperament and behavioral compatibility.' };
}

/**
 * Bhakoot Koota (max 7): compatibility by the distance between Moon
 * signs. Certain sign-distance pairs (2/12, 6/8, 5/9 from each other)
 * are classically considered inauspicious (Bhakoot dosha).
 */
function bhakootKoota(groomSignIdx, brideSignIdx) {
  const distance = (((brideSignIdx - groomSignIdx + 12) % 12) + 1);
  const inauspiciousDistances = new Set([2, 12, 6, 8, 5, 9]);
  const score = inauspiciousDistances.has(distance) ? 0 : 7;
  return { name: 'Bhakoot', maxScore: 7, score, description: 'Emotional, financial, and family-life compatibility.' };
}

/**
 * Nadi Koota (max 8): the single most heavily weighted koota. Each
 * Nakshatra belongs to one of 3 Nadi groups (Aadi/Madhya/Antya, indices
 * 0/1/2 repeating every 3 nakshatras); same Nadi is classically
 * inauspicious (Nadi Dosha) for progeny/health compatibility.
 */
function nadiKoota(groomNakIdx, brideNakIdx) {
  const nadiGroup = (idx) => idx % 3;
  const score = nadiGroup(groomNakIdx) === nadiGroup(brideNakIdx) ? 0 : 8;
  return { name: 'Nadi', maxScore: 8, score, description: 'Health and genetic compatibility for progeny.' };
}

/**
 * Computes the full classical Ashtakoot (36-point) Guna Milan between two
 * people's Moon sign + Nakshatra. Both inputs: { moonSign, nakshatra }.
 */
function calculateGunaMilan(groom, bride) {
  const groomSignIdx = ZODIAC_SIGNS.indexOf(groom.moonSign);
  const brideSignIdx = ZODIAC_SIGNS.indexOf(bride.moonSign);
  const groomNakIdx = nakIndex(groom.nakshatra);
  const brideNakIdx = nakIndex(bride.nakshatra);

  const kootas = [
    varnaKoota(groomSignIdx, brideSignIdx),
    vashyaKoota(groomSignIdx, brideSignIdx),
    taraKoota(groomNakIdx, brideNakIdx),
    yoniKoota(groomNakIdx, brideNakIdx),
    grahaMaitriKoota(groomNakIdx, brideNakIdx),
    ganaKoota(groomNakIdx, brideNakIdx),
    bhakootKoota(groomSignIdx, brideSignIdx),
    nadiKoota(groomNakIdx, brideNakIdx),
  ];

  const totalScore = kootas.reduce((sum, k) => sum + k.score, 0);
  const maxScore = kootas.reduce((sum, k) => sum + k.maxScore, 0);

  let verdict;
  if (totalScore >= 28) verdict = 'Excellent match';
  else if (totalScore >= 21) verdict = 'Good match';
  else if (totalScore >= 18) verdict = 'Average match - consider other factors';
  else verdict = 'Not recommended by classical Guna Milan scoring alone';

  const hasNadiDosha = kootas.find((k) => k.name === 'Nadi').score === 0;
  const hasBhakootDosha = kootas.find((k) => k.name === 'Bhakoot').score === 0;

  return { kootas, totalScore, maxScore, verdict, hasNadiDosha, hasBhakootDosha };
}

module.exports = { calculateGunaMilan };
