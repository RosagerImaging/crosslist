-- Alter table items to add deleted_at column
ALTER TABLE items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;