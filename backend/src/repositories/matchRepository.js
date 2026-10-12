const crypto = require('crypto');
const { pool } = require('../database/pool');

async function create(data) {
  const accessToken = crypto.randomUUID();
  const [result] = await pool.query(
    `INSERT INTO kundali_matches
      (access_token, groom_name, groom_date_of_birth, groom_time_of_birth, groom_place_of_birth,
       groom_moon_sign, groom_nakshatra, bride_name, bride_date_of_birth, bride_time_of_birth,
       bride_place_of_birth, bride_moon_sign, bride_nakshatra, total_score, max_score, verdict,
       koota_breakdown, created_by, customer_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      accessToken,
      data.groom.name, data.groom.dateOfBirth, data.groom.timeOfBirth, data.groom.placeOfBirth,
      data.groom.moonSign, data.groom.nakshatra,
      data.bride.name, data.bride.dateOfBirth, data.bride.timeOfBirth, data.bride.placeOfBirth,
      data.bride.moonSign, data.bride.nakshatra,
      data.totalScore, data.maxScore, data.verdict,
      JSON.stringify(data.kootas),
      data.createdBy || null,
      data.customerId || null,
    ]
  );
  return { id: result.insertId, accessToken };
}

async function fetchAccessTokenById(id) {
  const [[row]] = await pool.query('SELECT access_token FROM kundali_matches WHERE id = ?', [id]);
  return row ? row.access_token : null;
}

async function findById(id) {
  const [[row]] = await pool.query('SELECT * FROM kundali_matches WHERE id = ?', [id]);
  if (!row) return null;
  const { access_token, ...publicFields } = row;
  // mysql2 auto-parses native JSON columns into JS objects/arrays, so
  // koota_breakdown already comes back as real data here, not a string -
  // no JSON.parse() needed (it would fail, coercing the object to the
  // literal string "[object Object]" first).
  return publicFields;
}

async function findByCustomerId(customerId) {
  const [rows] = await pool.query(
    `SELECT id, groom_name, bride_name, total_score, max_score, verdict, created_at
     FROM kundali_matches WHERE customer_id = ? ORDER BY created_at DESC`,
    [customerId]
  );
  return rows;
}

module.exports = { create, findById, fetchAccessTokenById, findByCustomerId };
