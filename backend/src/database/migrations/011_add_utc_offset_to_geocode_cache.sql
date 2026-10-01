ALTER TABLE geocode_cache
  ADD COLUMN utc_offset_minutes INT NOT NULL DEFAULT 0 AFTER timezone;
