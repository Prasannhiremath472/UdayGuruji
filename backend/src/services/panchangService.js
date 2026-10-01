const panchangProvider = require('../providers/astrology/panchangProvider');
const { resolveBirthLocation } = require('./locationService');
const panchangCacheRepository = require('../repositories/panchangCacheRepository');

function buildPayload(dateStr, timeStr, location) {
  const [year, month, date] = dateStr.split('-').map(Number);
  const [hours, minutes] = (timeStr || '06:00').split(':').map(Number);
  return {
    year, month, date, hours, minutes, seconds: 0,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.utcOffsetMinutes / 60,
  };
}

async function getPanchang({ date, time, place }) {
  const approxUtcSeconds = Math.floor(new Date(`${date}T${time || '06:00'}:00Z`).getTime() / 1000);
  const location = await resolveBirthLocation(place, approxUtcSeconds);

  // Panchang for a given calendar date changes very little with the exact
  // time of day, so cache by (date, place) to avoid re-hitting the
  // rate-limited provider for repeat lookups of the same day/place.
  const cached = await panchangCacheRepository.find(date, location.latitude, location.longitude);
  if (cached) {
    return { date, place, location, ...cached };
  }

  const payload = buildPayload(date, time, location);
  const panchang = await panchangProvider.getFullPanchang(payload);
  await panchangCacheRepository.save(date, location.latitude, location.longitude, panchang);
  return { date, place, location, ...panchang };
}

async function getMuhurat({ date, time, place }) {
  const approxUtcSeconds = Math.floor(new Date(`${date}T${time || '06:00'}:00Z`).getTime() / 1000);
  const location = await resolveBirthLocation(place, approxUtcSeconds);
  const payload = buildPayload(date, time, location);
  const times = await panchangProvider.getGoodBadTimes(payload);
  return { date, place, location, ...times };
}

module.exports = { getPanchang, getMuhurat };
