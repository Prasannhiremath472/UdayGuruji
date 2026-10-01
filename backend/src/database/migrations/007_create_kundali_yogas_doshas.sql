CREATE TABLE IF NOT EXISTS kundali_yogas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kundali_id INT UNSIGNED NOT NULL,
  yoga_name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_yogas_kundali FOREIGN KEY (kundali_id) REFERENCES kundalis(id) ON DELETE CASCADE,
  KEY idx_yogas_kundali (kundali_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS kundali_doshas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kundali_id INT UNSIGNED NOT NULL,
  dosha_name VARCHAR(100) NOT NULL,
  present TINYINT(1) NOT NULL DEFAULT 0,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_doshas_kundali FOREIGN KEY (kundali_id) REFERENCES kundalis(id) ON DELETE CASCADE,
  KEY idx_doshas_kundali (kundali_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
