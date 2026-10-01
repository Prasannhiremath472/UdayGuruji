CREATE TABLE IF NOT EXISTS kundali_charts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kundali_id INT UNSIGNED NOT NULL,
  chart_type VARCHAR(20) NOT NULL,
  chart_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_charts_kundali FOREIGN KEY (kundali_id) REFERENCES kundalis(id) ON DELETE CASCADE,
  UNIQUE KEY uq_kundali_chart_type (kundali_id, chart_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
