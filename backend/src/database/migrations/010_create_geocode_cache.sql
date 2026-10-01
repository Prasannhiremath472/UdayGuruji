CREATE TABLE IF NOT EXISTS geocode_cache (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  place_query VARCHAR(255) NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  timezone VARCHAR(64) NOT NULL,
  resolved_place_name VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_geocode_place (place_query)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
