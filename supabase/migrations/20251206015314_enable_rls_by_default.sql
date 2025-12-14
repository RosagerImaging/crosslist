-- This migration serves as a reminder to enable Row Level Security (RLS) on all new tables.
-- RLS is critical for securing your data in Supabase.
-- For every new table created, ensure you add:
-- ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

ALTER ROLE authenticator SET row_security = on;