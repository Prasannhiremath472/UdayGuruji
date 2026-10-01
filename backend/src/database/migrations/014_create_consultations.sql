CREATE TABLE IF NOT EXISTS consultations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(30) NULL,
  kundali_id INT UNSIGNED NULL,
  question TEXT NOT NULL,
  status ENUM('pending', 'answered', 'closed') NOT NULL DEFAULT 'pending',
  admin_reply TEXT NULL,
  replied_by INT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  replied_at TIMESTAMP NULL,
  CONSTRAINT fk_consultations_kundali FOREIGN KEY (kundali_id) REFERENCES kundalis(id) ON DELETE SET NULL,
  CONSTRAINT fk_consultations_replied_by FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_consultations_status (status),
  KEY idx_consultations_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
