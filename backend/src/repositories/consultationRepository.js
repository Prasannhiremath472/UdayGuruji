const { pool } = require('../database/pool');

async function create({ fullName, email, phone, kundaliId, question }) {
  const [result] = await pool.query(
    `INSERT INTO consultations (full_name, email, phone, kundali_id, question)
     VALUES (?, ?, ?, ?, ?)`,
    [fullName, email || null, phone || null, kundaliId || null, question]
  );
  return result.insertId;
}

async function findById(id) {
  const [[row]] = await pool.query('SELECT * FROM consultations WHERE id = ?', [id]);
  return row || null;
}

async function search({ status, page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT * FROM consultations ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM consultations ${whereClause}`, params);

  return { rows, total };
}

async function reply(id, { adminReply, status, repliedBy }) {
  await pool.query(
    `UPDATE consultations SET admin_reply = ?, status = ?, replied_by = ?, replied_at = NOW() WHERE id = ?`,
    [adminReply, status, repliedBy, id]
  );
  return findById(id);
}

module.exports = { create, findById, search, reply };
