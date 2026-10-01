const { ZODIAC_SIGNS } = require('../constants/astrologyConstants');
const { ASHTAKAVARGA_TABLES } = require('../constants/ashtakavargaTables');
const { getTransitInterpretation } = require('../constants/transitInterpretations');

const ASHTAKAVARGA_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

function signIndex(signName) {
  return ZODIAC_SIGNS.indexOf(signName);
}

/**
 * Computes each planet's Bhinnashtakavarga (individual 12-house bindu
 * distribution) and the combined Sarvashtakavarga, per the classical
 * Parasara point tables in constants/ashtakavargaTables.js.
 *
 * @param {{planet:string, sign:string}[]} planets - the 9 grahas' sign
 *   placements (Rahu/Ketu are accepted but excluded from Ashtakavarga
 *   itself, per classical convention).
 * @param {string} lagnaSign
 * @returns {{planet:string, house:number, points:number}[]} flat rows:
 *   one row per (planet, house) for each of the 7 classical planets, plus
 *   rows with planet "SARVA" for the combined total.
 */
function calculateAshtakavarga(planets, lagnaSign) {
  const positions = { Lagna: signIndex(lagnaSign) };
  for (const p of planets) {
    if (p.sign) positions[p.planet] = signIndex(p.sign);
  }

  const results = [];
  const sarva = new Array(12).fill(0);

  for (const targetPlanet of ASHTAKAVARGA_PLANETS) {
    const table = ASHTAKAVARGA_TABLES[targetPlanet];
    const bindus = new Array(12).fill(0);

    for (const [contributor, benefitHouses] of Object.entries(table)) {
      const contributorSignIdx = positions[contributor];
      if (contributorSignIdx === undefined || contributorSignIdx < 0) continue;

      for (const houseOffset of benefitHouses) {
        // houseOffset is 1-indexed and counted inclusively from the
        // contributor's own sign (offset 1 = the contributor's sign itself).
        const targetSignIdx = (contributorSignIdx + houseOffset - 1) % 12;
        bindus[targetSignIdx] += 1;
      }
    }

    bindus.forEach((points, signIdx) => {
      // Re-express each sign's bindu count as a house number counted from
      // the Lagna, matching how the rest of the report labels houses.
      const houseFromLagna = ((signIdx - positions.Lagna + 12) % 12) + 1;
      results.push({ planet: targetPlanet, house: houseFromLagna, points });
      sarva[houseFromLagna - 1] += points;
    });
  }

  sarva.forEach((points, idx) => {
    results.push({ planet: 'SARVA', house: idx + 1, points });
  });

  return results;
}

function findPlanet(planets, name) {
  return planets.find((p) => p.planet === name);
}

/**
 * Doshas: mechanical positional checks with clear, widely-agreed
 * definitions. Each entry: { name, present, description }.
 */
function calculateDoshas(planets) {
  const doshas = [];

  const mars = findPlanet(planets, 'Mars');
  if (mars) {
    const manglikHouses = [1, 2, 4, 7, 8, 12];
    const isManglik = manglikHouses.includes(mars.house);
    doshas.push({
      name: 'Mangal Dosha (Manglik)',
      present: isManglik,
      description: isManglik
        ? `Mars is placed in house ${mars.house} from the Lagna, one of the houses (1, 2, 4, 7, 8, 12) that classically indicate Mangal Dosha.`
        : 'Mars is not placed in a house associated with Mangal Dosha (1, 2, 4, 7, 8, or 12 from the Lagna).',
    });
  }

  const rahu = findPlanet(planets, 'Rahu');
  const ketu = findPlanet(planets, 'Ketu');
  if (rahu && ketu) {
    const classicalPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const houses = classicalPlanets
      .map((name) => findPlanet(planets, name)?.house)
      .filter((h) => h !== undefined);

    // All 7 classical planets fall strictly between Rahu and Ketu's axis
    // (on one side of the Rahu-Ketu line, going around the chart one way).
    const isBetween = (house, from, to) => {
      if (from <= to) return house > from && house < to;
      return house > from || house < to;
    };
    const allOnOneSide =
      houses.length === classicalPlanets.length &&
      (houses.every((h) => isBetween(h, rahu.house, ketu.house) || h === rahu.house)
        || houses.every((h) => isBetween(h, ketu.house, rahu.house) || h === ketu.house));

    doshas.push({
      name: 'Kaal Sarp Dosha',
      present: allOnOneSide,
      description: allOnOneSide
        ? 'All seven classical planets are hemmed between Rahu and Ketu, indicating Kaal Sarp Dosha.'
        : 'The classical planets are not all hemmed between Rahu and Ketu - Kaal Sarp Dosha is not indicated.',
    });
  }

  return doshas;
}

/**
 * Yogas: a small, well-documented set of positional/conjunction yogas.
 * Kendra houses (from a reference point): 1, 4, 7, 10.
 */
function calculateYogas(planets) {
  const yogas = [];
  const kendraHouses = new Set([1, 4, 7, 10]);
  const houseDiff = (h1, h2) => {
    const diff = ((h1 - h2 + 12) % 12) + 1;
    return diff;
  };

  const moon = findPlanet(planets, 'Moon');
  const jupiter = findPlanet(planets, 'Jupiter');
  if (moon && jupiter) {
    const relativeHouse = houseDiff(jupiter.house, moon.house);
    const isGajakesari = kendraHouses.has(relativeHouse);
    if (isGajakesari) {
      yogas.push({
        name: 'Gajakesari Yoga',
        description: 'Jupiter is positioned in a kendra (1st, 4th, 7th, or 10th house) from the Moon, forming Gajakesari Yoga - associated with intelligence, reputation, and success.',
      });
    }
  }

  const sun = findPlanet(planets, 'Sun');
  const mercury = findPlanet(planets, 'Mercury');
  if (sun && mercury && sun.house === mercury.house) {
    yogas.push({
      name: 'Budhaditya Yoga',
      description: 'Sun and Mercury are conjunct in the same house, forming Budhaditya Yoga - associated with intelligence and analytical ability.',
    });
  }

  const mars = findPlanet(planets, 'Mars');
  if (moon && mars && moon.house === mars.house) {
    yogas.push({
      name: 'Chandra-Mangal Yoga',
      description: 'Moon and Mars are conjunct in the same house, forming Chandra-Mangal Yoga - associated with business acumen and material prosperity.',
    });
  }

  const venus = findPlanet(planets, 'Venus');
  if (moon && venus && moon.house === venus.house) {
    yogas.push({
      name: 'Chandra-Venus Yoga',
      description: 'Moon and Venus are conjunct in the same house, associated with artistic talent and charm.',
    });
  }

  if (sun && moon) {
    const relativeHouse = houseDiff(sun.house, moon.house);
    if (relativeHouse === 1) {
      yogas.push({
        name: 'Amavasya Yoga',
        description: 'Sun and Moon are conjunct (New Moon birth), associated with a strong-willed, self-driven temperament.',
      });
    }
  }

  return yogas;
}

/**
 * Computes current planetary transits (Gochar) relative to a natal
 * Lagna: for each currently-transiting planet, which house it falls in
 * counted from the natal Lagna sign, plus a short templated
 * interpretation. `currentPlanets` uses the same normalized shape as
 * natal planets ({planet, sign, ...}) but represents "where the planets
 * are right now", independent of the person's birth chart houses.
 */
function calculateTransits(currentPlanets, natalLagnaSign) {
  const lagnaIdx = signIndex(natalLagnaSign);
  if (lagnaIdx < 0) return [];

  return currentPlanets
    .filter((p) => p.sign)
    .map((p) => {
      const signIdx = signIndex(p.sign);
      const houseFromLagna = ((signIdx - lagnaIdx + 12) % 12) + 1;
      return {
        planet: p.planet,
        currentSign: p.sign,
        houseFromNatalLagna: houseFromLagna,
        retrograde: Boolean(p.retrograde),
        interpretation: getTransitInterpretation(p.planet, houseFromLagna),
      };
    });
}

module.exports = { calculateAshtakavarga, calculateDoshas, calculateYogas, calculateTransits };
