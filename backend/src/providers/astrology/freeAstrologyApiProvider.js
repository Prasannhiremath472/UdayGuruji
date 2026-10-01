const axios = require('axios');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const { ApiError } = require('../../utils/apiResponse');
const AstrologyProviderInterface = require('./astrologyProvider.interface');
const { ZODIAC_SIGNS } = require('../../constants/astrologyConstants');

const client = axios.create({
  baseURL: env.astrology.baseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': env.astrology.apiKey,
  },
});

/**
 * Adapter for freeastrologyapi.com (json.freeastrologyapi.com). Confirmed
 * against the live API on this key (see freeastrologyapi.com/api-docs/
 * indian-vedic-astrology-api-docs for the full catalog):
 *  - /planets/extended: full planet data (sign, house, nakshatra, pada,
 *    retrograde), keyed by planet name.
 *  - /navamsa-chart-info, /d10-chart-info, /d12-chart-info: divisional
 *    chart house/sign placement, keyed by numeric index with the planet
 *    name in `.name` - no nakshatra.
 *  - /vimsottari/maha-dasas-and-antar-dasas: Mahadasha -> Antardasha tree.
 *    Note the provider's spelling is "vimsottari" (no second 'h').
 * Ashtakavarga and Yogas/Doshas have no documented endpoints on this API's
 * free tier (confirmed via docs + live 403 probing) - generateKundali()
 * returns empty arrays for those; the report shows "No data available"
 * rather than failing.
 */
class FreeAstrologyApiProvider extends AstrologyProviderInterface {
  buildPayload(birthInput) {
    return {
      year: birthInput.year,
      month: birthInput.month,
      date: birthInput.date,
      hours: birthInput.hours,
      minutes: birthInput.minutes,
      seconds: birthInput.seconds || 0,
      latitude: birthInput.latitude,
      longitude: birthInput.longitude,
      timezone: birthInput.utcOffsetHours,
      settings: {
        observation_point: 'topocentric',
        ayanamsha: 'lahiri',
      },
    };
  }

  async callEndpoint(path, payload, retriesLeft = 2) {
    if (!env.astrology.apiKey) {
      throw new ApiError(500, 'Astrology provider is not configured', 'ASTROLOGY_PROVIDER_NOT_CONFIGURED');
    }
    try {
      const response = await client.post(path, payload);
      return response.data;
    } catch (err) {
      const status = err.response?.status;

      // A 429 is transient (free-tier rate limit) - retry with a short
      // backoff rather than silently returning an incomplete report.
      if (status === 429 && retriesLeft > 0) {
        const delayMs = (3 - retriesLeft) * 1500;
        logger.error(`Free Astrology API rate limited (${path}), retrying in ${delayMs}ms (${retriesLeft} left)`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return this.callEndpoint(path, payload, retriesLeft - 1);
      }

      logger.error(`Free Astrology API call failed (${path}): ${err.message}`);
      if (status === 401 || status === 403) {
        throw new ApiError(502, 'Astrology provider rejected the request credentials', 'ASTROLOGY_PROVIDER_AUTH_ERROR');
      }
      if (status === 429) {
        throw new ApiError(503, 'Astrology calculation service is busy, please try again shortly', 'ASTROLOGY_PROVIDER_RATE_LIMITED');
      }
      throw new ApiError(502, 'Astrology calculation service is currently unavailable', 'ASTROLOGY_PROVIDER_ERROR');
    }
  }

  /**
   * /planets/extended's `output` is keyed by planet name (plus an
   * "Ascendant" entry with no house_number of its own - it defines house 1).
   */
  normalizeExtendedPlanets(output) {
    if (!output || typeof output !== 'object') return [];
    return Object.entries(output)
      .filter(([name]) => name !== 'Ascendant' && name !== 'debug')
      .map(([name, p]) => ({
        planet: name,
        sign: p.zodiac_sign_name,
        degree: parseFloat(p.normDegree ?? 0),
        house: p.house_number,
        nakshatra: (p.nakshatra_name || '').replace(/\(.*\)$/, '').trim(),
        nakshatraPada: p.nakshatra_pada,
        retrograde: p.isRetro === 'true' || p.isRetro === true,
      }));
  }

  /**
   * /navamsa-chart-info's `output` is keyed by numeric index strings
   * ("0", "1", ...), each entry carrying the real planet name in `.name`
   * (same convention as the plain /planets endpoint) - only current_sign
   * (numeric 1-12) and house_number, no nakshatra.
   */
  normalizeDivisionalChart(output) {
    if (!output || typeof output !== 'object') return [];
    const houses = {};
    for (const p of Object.values(output)) {
      if (!p || p.name === 'Ascendant' || !p.house_number) continue;
      const house = p.house_number;
      if (!houses[house]) houses[house] = [];
      houses[house].push(p.name);
    }
    return Object.entries(houses).map(([house, planetsInHouse]) => ({
      house: parseInt(house, 10),
      planets: planetsInHouse,
    }));
  }

  /**
   * /vimsottari/maha-dasas-and-antar-dasas returns `output` as a JSON
   * *string* (not an object): { [mahadashaPlanet]: { [antardashaPlanet]:
   * {start_time, end_time} } }. The Mahadasha's own start/end is the span
   * of its first and last Antardasha entries.
   */
  normalizeDashaTree(outputRaw) {
    if (!outputRaw) return [];
    let parsed;
    try {
      parsed = typeof outputRaw === 'string' ? JSON.parse(outputRaw) : outputRaw;
    } catch {
      return [];
    }

    return Object.entries(parsed).map(([mahaPlanet, antardashas]) => {
      const children = Object.entries(antardashas).map(([antarPlanet, period]) => ({
        level: 2,
        planet: antarPlanet,
        startDate: period.start_time?.slice(0, 10),
        endDate: period.end_time?.slice(0, 10),
      }));
      return {
        level: 1,
        planet: mahaPlanet,
        startDate: children[0]?.startDate,
        endDate: children[children.length - 1]?.endDate,
        children,
      };
    });
  }

  async generateKundali(birthInput) {
    const payload = this.buildPayload(birthInput);

    const [extendedData, navamsaData, dashaData] = await Promise.all([
      this.callEndpoint('/planets/extended', payload),
      this.callEndpoint('/navamsa-chart-info', payload).catch((err) => {
        logger.error(`Navamsa chart unavailable, continuing without it: ${err.message}`);
        return null;
      }),
      this.callEndpoint('/vimsottari/maha-dasas-and-antar-dasas', payload).catch((err) => {
        logger.error(`Vimshottari Dasha unavailable, continuing without it: ${err.message}`);
        return null;
      }),
    ]);

    const extendedOutput = extendedData?.output || {};
    const planets = this.normalizeExtendedPlanets(extendedOutput);

    const ascendantRaw = extendedOutput.Ascendant;
    const lagna = ascendantRaw?.zodiac_sign_name || ZODIAC_SIGNS[0];

    const moon = planets.find((p) => p.planet === 'Moon');
    const rashi = moon?.sign || lagna;
    const nakshatra = moon?.nakshatra || ascendantRaw?.nakshatra_name || '';
    const nakshatraPada = moon?.nakshatraPada || ascendantRaw?.nakshatra_pada || 1;

    const d1Houses = {};
    for (const p of planets) {
      if (!p.house) continue;
      if (!d1Houses[p.house]) d1Houses[p.house] = [];
      d1Houses[p.house].push(p.planet);
    }

    return {
      lagna,
      rashi,
      nakshatra,
      nakshatraPada,
      planets,
      divisionalCharts: {
        D1: Object.entries(d1Houses).map(([house, planetsInHouse]) => ({
          house: parseInt(house, 10),
          planets: planetsInHouse,
        })),
        D9: navamsaData ? this.normalizeDivisionalChart(navamsaData.output) : [],
      },
      vimshottariDasha: dashaData ? this.normalizeDashaTree(dashaData.output) : [],
      yogas: [],
      doshas: [],
      ashtakavarga: [],
      raw: { extendedData, navamsaData, dashaData },
    };
  }
}

module.exports = new FreeAstrologyApiProvider();
