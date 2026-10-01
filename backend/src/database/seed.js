const bcrypt = require('bcryptjs');
const { pool } = require('./pool');
const env = require('../config/env');
const logger = require('../utils/logger');

async function run() {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [env.seedAdmin.email]);
  if (existing.length > 0) {
    logger.info(`Seed admin already exists (${env.seedAdmin.email}), skipping.`);
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash(env.seedAdmin.password, 10);
  await pool.query(
    'INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)',
    [env.seedAdmin.name, env.seedAdmin.email, passwordHash, 'admin']
  );

  logger.info(`Seed admin created: ${env.seedAdmin.email}`);
  await pool.end();
}

run().catch((err) => {
  logger.error(err);
  process.exit(1);
});
