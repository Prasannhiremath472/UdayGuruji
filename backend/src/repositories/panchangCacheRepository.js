const { pool } = require('../database/pool');

// Round to 2 decimal places (~1.1km precision) so nearby lookups for the
// "same place" on the same date share a cache entry.
function roundCoord(value) {
  return Math.round(value * 100) / 100;
}

async function find(date, latitude, longitude) {
  const [[row]] = await pool.query(
    'SELECT panchang_json FROM panchang_cache WHERE cache_date = ? AND latitude = ? AND longitude = ?',
    [date, roundCoord(latitude), roundCoord(longitude)]
  );
  // mysql2 auto-parses native JSON columns into JS objects, so
  // panchang_json already comes back as an object here, not a string -
  // JSON.parse()'ing it would coerce it to "[object Object]" first and
  // then fail. No parsing needed, just return it as-is.
  return row ? row.panchang_json : null;
}

async function save(date, latitude, longitude, panchangData) {
  await pool.query(
    `INSERT INTO panchang_cache (cache_date, latitude, longitude, panchang_json)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE panchang_json = VALUES(panchang_json)`,
    [date, roundCoord(latitude), roundCoord(longitude), JSON.stringify(panchangData)]
  );
}

module.exports = { find, save };
