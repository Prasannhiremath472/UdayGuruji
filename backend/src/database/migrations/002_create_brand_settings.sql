CREATE TABLE IF NOT EXISTS brand_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  site_name VARCHAR(150) NOT NULL DEFAULT 'UdayGuruji Kundali',
  logo_url VARCHAR(500) NULL,
  primary_color VARCHAR(20) NOT NULL DEFAULT '#7A2E2E',
  contact_email VARCHAR(190) NULL,
  contact_phone VARCHAR(30) NULL,
  footer_text VARCHAR(500) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO brand_settings (id, site_name, primary_color)
SELECT 1, 'UdayGuruji Kundali', '#7A2E2E'
WHERE NOT EXISTS (SELECT 1 FROM brand_settings WHERE id = 1);
