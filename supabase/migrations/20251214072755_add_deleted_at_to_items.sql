-- Alter table items to add deleted_at column
ALTER TABLE items ADD COLUMN deleted_at TIMESTAMPTZ;