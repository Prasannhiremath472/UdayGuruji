const { pool } = require('../database/pool');

async function findByQuery(placeQuery) {
  const [[row]] = await pool.query(
    'SELECT * FROM geocode_cache WHERE place_query = ?',
    [placeQuery.trim().toLowerCase()]
  );
  return row || null;
}

async function save({ placeQuery, latitude, longitude, timezone, utcOffsetMinutes, resolvedPlaceName }) {
  await pool.query(
    `INSERT INTO geocode_cache (place_query, latitude, longitude, timezone, utc_offset_minutes, resolved_place_name)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude),
       timezone = VALUES(timezone), utc_offset_minutes = VALUES(utc_offset_minutes),
       resolved_place_name = VALUES(resolved_place_name)`,
    [placeQuery.trim().toLowerCase(), latitude, longitude, timezone, utcOffsetMinutes, resolvedPlaceName || null]
  );
}

module.exports = { findByQuery, save };
