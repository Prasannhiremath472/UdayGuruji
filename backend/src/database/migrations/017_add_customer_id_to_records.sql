ALTER TABLE kundalis
  ADD COLUMN customer_id INT UNSIGNED NULL AFTER created_by,
  ADD CONSTRAINT fk_kundalis_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  ADD KEY idx_kundalis_customer (customer_id);

ALTER TABLE kundali_matches
  ADD COLUMN customer_id INT UNSIGNED NULL AFTER created_by,
  ADD CONSTRAINT fk_matches_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  ADD KEY idx_matches_customer (customer_id);
