-- Create Enum Types
CREATE TYPE public.item_condition AS ENUM ('new', 'like_new', 'used', 'for_parts');
CREATE TYPE public.item_status AS ENUM ('active', 'sold', 'draft', 'deleted');
CREATE TYPE public.marketplace_name AS ENUM ('ebay', 'poshmark', 'mercari');
CREATE TYPE public.listing_status AS ENUM ('active', 'sold', 'delisted');

-- Create Items Table
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  sku TEXT,
  condition public.item_condition NOT NULL,
  status public.item_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Constraint: SKU unique per user
  UNIQUE(user_id, sku)
);

-- Create Item Images Table
CREATE TABLE public.item_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Marketplace Listings Table
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  marketplace public.marketplace_name NOT NULL,
  external_id TEXT NOT NULL,
  status public.listing_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Policies for Items
CREATE POLICY "Users can view own items" 
ON public.items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items" 
ON public.items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" 
ON public.items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items" 
ON public.items FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for Item Images
-- (Users can only access images belonging to items they own)
CREATE POLICY "Users can view own item images" 
ON public.item_images FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.items 
    WHERE items.id = item_images.item_id 
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own item images" 
ON public.item_images FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.items 
    WHERE items.id = item_images.item_id 
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own item images" 
ON public.item_images FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.items 
    WHERE items.id = item_images.item_id 
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own item images" 
ON public.item_images FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.items 
    WHERE items.id = item_images.item_id 
    AND items.user_id = auth.uid()
  )
);

-- Policies for Marketplace Listings
-- (Users can only access listings belonging to items they own)
CREATE POLICY "Users can view own listings" 
ON public.marketplace_listings FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.items 
    WHERE items.id = marketplace_listings.item_id 
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own listings" 
ON public.marketplace_listings FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.items 
    WHERE items.id = marketplace_listings.item_id 
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own listings" 
ON public.marketplace_listings FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.items 
    WHERE items.id = marketplace_listings.item_id 
    AND items.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own listings" 
ON public.marketplace_listings FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.items 
    WHERE items.id = marketplace_listings.item_id 
    AND items.user_id = auth.uid()
  )
);

-- Create updated_at triggers
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

CREATE TRIGGER handle_updated_at_items
BEFORE UPDATE ON public.items
FOR EACH ROW
EXECUTE PROCEDURE extensions.moddatetime (updated_at);

CREATE TRIGGER handle_updated_at_listings
BEFORE UPDATE ON public.marketplace_listings
FOR EACH ROW
EXECUTE PROCEDURE extensions.moddatetime (updated_at);
