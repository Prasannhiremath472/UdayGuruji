const { pool } = require('../database/pool');

async function get() {
  const [[settings]] = await pool.query('SELECT * FROM brand_settings WHERE id = 1');
  return settings || null;
}

async function update({ siteName, logoUrl, primaryColor, contactEmail, contactPhone, footerText }) {
  await pool.query(
    `UPDATE brand_settings SET
      site_name = COALESCE(?, site_name),
      logo_url = COALESCE(?, logo_url),
      primary_color = COALESCE(?, primary_color),
      contact_email = COALESCE(?, contact_email),
      contact_phone = COALESCE(?, contact_phone),
      footer_text = COALESCE(?, footer_text)
     WHERE id = 1`,
    [siteName, logoUrl, primaryColor, contactEmail, contactPhone, footerText]
  );
  return get();
}

async function insertAuditLog({ userId, action, entityType, entityId, metadata, ipAddress }) {
  await pool.query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata, ip_address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId || null, action, entityType || null, entityId || null, JSON.stringify(metadata || {}), ipAddress || null]
  );
}

module.exports = { get, update, insertAuditLog };
