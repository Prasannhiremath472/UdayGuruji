const { pool } = require('../database/pool');

async function findByEmail(email) {
  const [[user]] = await pool.query('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);
  return user || null;
}

async function findById(id) {
  const [[user]] = await pool.query(
    'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?',
    [id]
  );
  return user || null;
}

async function create({ name, email, passwordHash, role = 'staff' }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return result.insertId;
}

async function list() {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
}

module.exports = { findByEmail, findById, create, list };
