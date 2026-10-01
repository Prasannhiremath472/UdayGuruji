CREATE TABLE IF NOT EXISTS kundali_ashtakavarga (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kundali_id INT UNSIGNED NOT NULL,
  planet VARCHAR(30) NOT NULL COMMENT 'individual planet name or SARVA for combined',
  house TINYINT UNSIGNED NOT NULL,
  points TINYINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ashtakavarga_kundali FOREIGN KEY (kundali_id) REFERENCES kundalis(id) ON DELETE CASCADE,
  KEY idx_ashtakavarga_kundali (kundali_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
