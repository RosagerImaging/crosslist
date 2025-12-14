-- This file serves as a template for creating new tables in your Supabase project.
-- Remember to enable Row Level Security (RLS) for all new tables.

CREATE TABLE public.your_new_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Add your table columns here
    name TEXT NOT NULL
);

ALTER TABLE public.your_new_table ENABLE ROW LEVEL SECURITY;

-- Optional: Create RLS policies for your_new_table
-- CREATE POLICY "Enable read access for all users"
-- ON public.your_new_table FOR SELECT
-- USING (TRUE);

-- CREATE POLICY "Enable insert for authenticated users only"
-- ON public.your_new_table FOR INSERT
-- WITH CHECK ((SELECT auth.uid()) IS NOT NULL);