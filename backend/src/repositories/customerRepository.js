const { pool } = require('../database/pool');

async function findByEmail(email) {
  const [[customer]] = await pool.query('SELECT * FROM customers WHERE email = ? AND is_active = 1', [email]);
  return customer || null;
}

async function findById(id) {
  const [[customer]] = await pool.query(
    'SELECT id, name, email, phone, is_active, created_at FROM customers WHERE id = ?',
    [id]
  );
  return customer || null;
}

async function create({ name, email, phone, passwordHash }) {
  const [result] = await pool.query(
    'INSERT INTO customers (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
    [name, email, phone || null, passwordHash]
  );
  return result.insertId;
}

module.exports = { findByEmail, findById, create };
