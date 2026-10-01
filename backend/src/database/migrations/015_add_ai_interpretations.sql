ALTER TABLE kundalis
  ADD COLUMN personality_summary TEXT NULL AFTER nakshatra_pada;

ALTER TABLE kundali_yogas
  ADD COLUMN ai_explanation TEXT NULL AFTER description;

ALTER TABLE kundali_doshas
  ADD COLUMN ai_explanation TEXT NULL AFTER description;

ALTER TABLE kundali_dashas
  ADD COLUMN ai_narrative TEXT NULL AFTER end_date;
