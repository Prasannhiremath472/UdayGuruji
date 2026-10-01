const axios = require('axios');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const { ApiError } = require('../../utils/apiResponse');

const client = axios.create({
  baseURL: env.astrology.baseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': env.astrology.apiKey,
  },
});

/**
 * Panchang/Muhurat data via freeastrologyapi.com's confirmed-working
 * endpoints (see providers/astrology/freeAstrologyApiProvider.js header
 * comment for how the full endpoint catalog was discovered/verified).
 * Unlike the main Kundali flow, these endpoints return `output` as a
 * JSON *string* (sometimes double-encoded) that must be parsed, and
 * good-bad-times bundles several stringified sub-objects under separate
 * top-level keys instead of one `output` field.
 */
async function callEndpoint(path, payload, retriesLeft = 2) {
  if (!env.astrology.apiKey) {
    throw new ApiError(500, 'Astrology provider is not configured', 'ASTROLOGY_PROVIDER_NOT_CONFIGURED');
  }
  try {
    const response = await client.post(path, payload);
    return response.data;
  } catch (err) {
    const status = err.response?.status;
    if (status === 429 && retriesLeft > 0) {
      const delayMs = (3 - retriesLeft) * 1500;
      logger.error(`Free Astrology API rate limited (${path}), retrying in ${delayMs}ms`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return callEndpoint(path, payload, retriesLeft - 1);
    }
    logger.error(`Panchang provider call failed (${path}): ${err.message}`);
    if (status === 429) {
      throw new ApiError(503, 'Panchang service is busy, please try again shortly', 'ASTROLOGY_PROVIDER_RATE_LIMITED');
    }
    throw new ApiError(502, 'Panchang service is currently unavailable', 'ASTROLOGY_PROVIDER_ERROR');
  }
}

function parseOutput(raw) {
  if (raw === undefined || raw === null) return null;
  let value = raw;
  // Some endpoints double-encode: output is a JSON string, and parsing it
  // once can yield another JSON string (seen on yoga/karana-durations).
  for (let i = 0; i < 2 && typeof value === 'string'; i += 1) {
    try {
      value = JSON.parse(value);
    } catch {
      break;
    }
  }
  return value;
}

/**
 * Fetches the full Panchang (five limbs: Tithi, Vara, Nakshatra, Yoga,
 * Karana) plus sunrise/sunset for a given date+place, in one batch of
 * parallel calls against confirmed-working endpoints.
 */
async function getFullPanchang(payload) {
  const [tithi, nakshatra, yoga, karana, weekday, sunTimes] = await Promise.all([
    callEndpoint('/tithi-durations', payload),
    callEndpoint('/nakshatra-durations', payload),
    callEndpoint('/yoga-durations', payload),
    callEndpoint('/karana-durations', payload),
    callEndpoint('/vedicweekday', payload),
    callEndpoint('/getsunriseandset', payload),
  ]);

  return {
    tithi: parseOutput(tithi.output),
    nakshatra: parseOutput(nakshatra.output),
    yoga: parseOutput(yoga.output),
    karana: parseOutput(karana.output),
    weekday: weekday.output,
    sunrise: sunTimes.output?.sun_rise_time,
    sunset: sunTimes.output?.sun_set_time,
  };
}

/**
 * Fetches the auspicious/inauspicious muhurat windows for a given
 * date+place (Abhijit, Amrit Kaal, Brahma Muhurat = favorable; Rahu
 * Kalam, Yama Gandam, Gulika Kalam, Dur Muhurat, Varjyam = unfavorable).
 */
async function getGoodBadTimes(payload) {
  const data = await callEndpoint('/good-bad-times', payload);
  // Note: the provider's key is "rahu_kaalam_data" (double 'a'), not the
  // more common spelling "rahu_kalam_data" - confirmed via live response.
  const keys = ['abhijit_data', 'amrit_kaal_data', 'brahma_muhurat_data', 'rahu_kaalam_data', 'yama_gandam_data', 'gulika_kalam_data', 'dur_muhurat_data', 'varjyam_data'];
  const result = {};
  for (const key of keys) {
    if (data[key] !== undefined) {
      const normalizedKey = key.replace('_data', '').replace('rahu_kaalam', 'rahu_kalam');
      result[normalizedKey] = parseOutput(data[key]);
    }
  }
  return result;
}

module.exports = { getFullPanchang, getGoodBadTimes };
