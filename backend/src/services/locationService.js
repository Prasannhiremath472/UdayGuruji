const nominatimProvider = require('../providers/geocoding/nominatimProvider');
const timezoneDbProvider = require('../providers/timezone/timezoneDbProvider');
const geocodeCacheRepository = require('../repositories/geocodeCacheRepository');

/**
 * Resolves a free-text place of birth into lat/lng/timezone, using a
 * database cache to avoid repeat calls to the geocoding/timezone providers
 * for the same place string.
 */
async function resolveBirthLocation(placeOfBirth, birthDateTimeUtcSeconds) {
  const cached = await geocodeCacheRepository.findByQuery(placeOfBirth);
  if (cached) {
    return {
      latitude: parseFloat(cached.latitude),
      longitude: parseFloat(cached.longitude),
      timezone: cached.timezone,
      utcOffsetMinutes: cached.utc_offset_minutes,
      resolvedPlaceName: cached.resolved_place_name,
    };
  }

  const geocoded = await nominatimProvider.resolve(placeOfBirth);
  const tz = await timezoneDbProvider.resolve({
    latitude: geocoded.latitude,
    longitude: geocoded.longitude,
    timestamp: birthDateTimeUtcSeconds,
  });

  await geocodeCacheRepository.save({
    placeQuery: placeOfBirth,
    latitude: geocoded.latitude,
    longitude: geocoded.longitude,
    timezone: tz.timezone,
    utcOffsetMinutes: tz.utcOffsetMinutes,
    resolvedPlaceName: geocoded.resolvedPlaceName,
  });

  return {
    latitude: geocoded.latitude,
    longitude: geocoded.longitude,
    timezone: tz.timezone,
    utcOffsetMinutes: tz.utcOffsetMinutes,
    resolvedPlaceName: geocoded.resolvedPlaceName,
  };
}

module.exports = { resolveBirthLocation };
