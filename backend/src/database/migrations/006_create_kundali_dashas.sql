CREATE TABLE IF NOT EXISTS kundali_dashas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kundali_id INT UNSIGNED NOT NULL,
  dasha_level TINYINT UNSIGNED NOT NULL COMMENT '1=Mahadasha 2=Antardasha 3=Pratyantardasha',
  planet VARCHAR(30) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  parent_dasha_id INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dashas_kundali FOREIGN KEY (kundali_id) REFERENCES kundalis(id) ON DELETE CASCADE,
  CONSTRAINT fk_dashas_parent FOREIGN KEY (parent_dasha_id) REFERENCES kundali_dashas(id) ON DELETE CASCADE,
  KEY idx_dashas_kundali (kundali_id),
  KEY idx_dashas_parent (parent_dasha_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
