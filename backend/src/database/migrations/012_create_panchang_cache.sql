CREATE TABLE IF NOT EXISTS panchang_cache (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cache_date DATE NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  panchang_json JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_panchang_date_location (cache_date, latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
