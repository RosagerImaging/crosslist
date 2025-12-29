-- Create table for storing OAuth marketplace connections
create table if not exists public.marketplace_connections (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    marketplace text not null check (marketplace in ('ebay', 'poshmark')),
    access_token text not null,
    refresh_token text,
    expires_at timestamptz not null,
    token_type text not null,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint marketplace_connections_pkey primary key (id),
    constraint marketplace_connections_user_id_marketplace_key unique (user_id, marketplace)
);

-- Enable RLS
alter table public.marketplace_connections enable row level security;

-- Create RLS Policies
create policy "Users can view their own connections"
    on public.marketplace_connections
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own connections"
    on public.marketplace_connections
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own connections"
    on public.marketplace_connections
    for update
    using (auth.uid() = user_id);

create policy "Users can delete their own connections"
    on public.marketplace_connections
    for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_marketplace_connections_updated_at
    before update on public.marketplace_connections
    for each row
    execute function public.handle_updated_at();
