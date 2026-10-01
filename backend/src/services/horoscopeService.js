const { ApiError } = require('../utils/apiResponse');
const { RASHIS, CATEGORIES, SNIPPETS } = require('../constants/horoscopeTemplates');

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function periodKey(period, date) {
  const d = new Date(date);
  if (period === 'weekly') {
    // ISO week number, so the same snippet holds for the whole week.
    const firstJan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - firstJan) / 86400000 + firstJan.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
  }
  if (period === 'monthly') {
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
  }
  return date; // daily
}

/**
 * Returns a deterministic (not random) horoscope snippet per
 * rashi+period+category, so it's stable for the whole period rather than
 * changing on every request, without needing to persist anything.
 */
function getHoroscope(rashi, period = 'daily', referenceDate = new Date().toISOString().slice(0, 10)) {
  if (!RASHIS.includes(rashi)) {
    throw new ApiError(400, `Unknown rashi: ${rashi}`, 'INVALID_RASHI');
  }
  if (!['daily', 'weekly', 'monthly'].includes(period)) {
    throw new ApiError(400, `Unknown period: ${period}`, 'INVALID_PERIOD');
  }

  const key = periodKey(period, referenceDate);

  const categories = CATEGORIES.reduce((acc, category) => {
    const pool = SNIPPETS[category];
    const index = hashString(`${rashi}-${category}-${key}`) % pool.length;
    acc[category] = pool[index];
    return acc;
  }, {});

  return { rashi, period, periodKey: key, categories };
}

function getAllRashis() {
  return RASHIS;
}

module.exports = { getHoroscope, getAllRashis };
