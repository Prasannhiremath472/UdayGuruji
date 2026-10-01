const crypto = require('crypto');
const { pool, withTransaction } = require('../database/pool');

async function createKundali(connection, data) {
  const accessToken = crypto.randomUUID();
  const [result] = await connection.query(
    `INSERT INTO kundalis
      (access_token, full_name, gender, date_of_birth, time_of_birth, place_of_birth, latitude, longitude,
       timezone, utc_offset_minutes, ayanamsa, language_preference, lagna, rashi, nakshatra,
       nakshatra_pada, personality_summary, status, raw_response, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      accessToken,
      data.fullName,
      data.gender || null,
      data.dateOfBirth,
      data.timeOfBirth,
      data.placeOfBirth,
      data.latitude,
      data.longitude,
      data.timezone,
      data.utcOffsetMinutes,
      data.ayanamsa || 'Lahiri',
      data.languagePreference || 'en',
      data.lagna,
      data.rashi,
      data.nakshatra,
      data.nakshatraPada,
      data.personalitySummary || null,
      data.status || 'completed',
      JSON.stringify(data.rawResponse || {}),
      data.createdBy || null,
    ]
  );
  return { id: result.insertId, accessToken };
}

async function insertPlanets(connection, kundaliId, planets) {
  if (!planets || planets.length === 0) return;
  const values = planets.map((p) => [
    kundaliId, p.planet, p.sign, p.degree, p.house || 0, p.nakshatra || null,
    p.nakshatraPada || null, p.retrograde ? 1 : 0,
  ]);
  await connection.query(
    `INSERT INTO kundali_planets
      (kundali_id, planet, sign, degree, house, nakshatra, nakshatra_pada, retrograde)
     VALUES ?`,
    [values]
  );
}

async function insertCharts(connection, kundaliId, divisionalCharts) {
  const entries = Object.entries(divisionalCharts || {}).filter(([, v]) => v && v.length);
  if (entries.length === 0) return;
  const values = entries.map(([chartType, chartJson]) => [
    kundaliId, chartType, JSON.stringify(chartJson),
  ]);
  await connection.query(
    `INSERT INTO kundali_charts (kundali_id, chart_type, chart_json) VALUES ?`,
    [values]
  );
}

function flattenDashaTree(kundaliId, nodes, parentId = null, level = 1) {
  const rows = [];
  for (const node of nodes || []) {
    rows.push({ kundaliId, level, planet: node.planet, startDate: node.startDate, endDate: node.endDate, parentId, children: node.children });
  }
  return rows;
}

async function insertDashas(connection, kundaliId, dashaTree) {
  if (!dashaTree || dashaTree.length === 0) return;

  async function insertLevel(nodes, parentId, level) {
    for (const node of nodes) {
      if (!node.startDate || !node.endDate) continue;
      const [result] = await connection.query(
        `INSERT INTO kundali_dashas (kundali_id, dasha_level, planet, start_date, end_date, ai_narrative, parent_dasha_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [kundaliId, level, node.planet, node.startDate, node.endDate, node.aiNarrative || null, parentId]
      );
      if (node.children && node.children.length) {
        await insertLevel(node.children, result.insertId, level + 1);
      }
    }
  }

  await insertLevel(dashaTree, null, 1);
}

async function insertYogas(connection, kundaliId, yogas) {
  if (!yogas || yogas.length === 0) return;
  const values = yogas.map((y) => [kundaliId, y.name, y.description || null, y.aiExplanation || null]);
  await connection.query(
    `INSERT INTO kundali_yogas (kundali_id, yoga_name, description, ai_explanation) VALUES ?`,
    [values]
  );
}

async function insertDoshas(connection, kundaliId, doshas) {
  if (!doshas || doshas.length === 0) return;
  const values = doshas.map((d) => [kundaliId, d.name, d.present ? 1 : 0, d.description || null, d.aiExplanation || null]);
  await connection.query(
    `INSERT INTO kundali_doshas (kundali_id, dosha_name, present, description, ai_explanation) VALUES ?`,
    [values]
  );
}

async function insertAshtakavarga(connection, kundaliId, ashtakavarga) {
  if (!ashtakavarga || ashtakavarga.length === 0) return;
  const values = ashtakavarga.map((a) => [kundaliId, a.planet, a.house, a.points]);
  await connection.query(
    `INSERT INTO kundali_ashtakavarga (kundali_id, planet, house, points) VALUES ?`,
    [values]
  );
}

async function saveFullKundali(data) {
  return withTransaction(async (connection) => {
    const { id: kundaliId, accessToken } = await createKundali(connection, data);
    await insertPlanets(connection, kundaliId, data.planets);
    await insertCharts(connection, kundaliId, data.divisionalCharts);
    await insertDashas(connection, kundaliId, data.vimshottariDasha);
    await insertYogas(connection, kundaliId, data.yogas);
    await insertDoshas(connection, kundaliId, data.doshas);
    await insertAshtakavarga(connection, kundaliId, data.ashtakavarga);
    return { id: kundaliId, accessToken };
  });
}

async function fetchAccessTokenById(id) {
  const [[row]] = await pool.query('SELECT access_token FROM kundalis WHERE id = ?', [id]);
  return row ? row.access_token : null;
}

async function findById(id) {
  const [[kundali]] = await pool.query('SELECT * FROM kundalis WHERE id = ?', [id]);
  if (!kundali) return null;

  const [planets, charts, dashas, yogas, doshas, ashtakavarga] = await Promise.all([
    pool.query('SELECT * FROM kundali_planets WHERE kundali_id = ? ORDER BY house', [id]),
    pool.query('SELECT * FROM kundali_charts WHERE kundali_id = ?', [id]),
    pool.query('SELECT * FROM kundali_dashas WHERE kundali_id = ? ORDER BY start_date', [id]),
    pool.query('SELECT * FROM kundali_yogas WHERE kundali_id = ?', [id]),
    pool.query('SELECT * FROM kundali_doshas WHERE kundali_id = ?', [id]),
    pool.query('SELECT * FROM kundali_ashtakavarga WHERE kundali_id = ? ORDER BY house', [id]),
  ]);

  const { access_token, raw_response, ...publicFields } = kundali;

  return {
    ...publicFields,
    planets: planets[0],
    charts: charts[0],
    dashas: dashas[0],
    yogas: yogas[0],
    doshas: doshas[0],
    ashtakavarga: ashtakavarga[0],
  };
}

async function search({ query, dateFrom, dateTo, page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];

  if (query) {
    conditions.push('(full_name LIKE ? OR place_of_birth LIKE ?)');
    params.push(`%${query}%`, `%${query}%`);
  }
  if (dateFrom) {
    conditions.push('date_of_birth >= ?');
    params.push(dateFrom);
  }
  if (dateTo) {
    conditions.push('date_of_birth <= ?');
    params.push(dateTo);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT id, full_name, gender, date_of_birth, time_of_birth, place_of_birth, lagna, rashi, nakshatra, status, created_at
     FROM kundalis ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM kundalis ${whereClause}`,
    params
  );

  return { rows, total };
}

async function deleteById(id) {
  const [result] = await pool.query('DELETE FROM kundalis WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  saveFullKundali,
  findById,
  fetchAccessTokenById,
  search,
  deleteById,
};
