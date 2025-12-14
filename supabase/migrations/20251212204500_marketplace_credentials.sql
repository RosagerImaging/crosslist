-- Create table for storing encrypted marketplace credentials
create table if not exists public.marketplace_credentials (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    marketplace_type text not null check (marketplace_type in ('ebay', 'poshmark')),
    credential_data text not null, -- Stores the encrypted blob
    is_connected boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    
    constraint marketplace_credentials_pkey primary key (id),
    constraint marketplace_credentials_user_id_marketplace_type_key unique (user_id, marketplace_type)
);

-- Enable RLS
alter table public.marketplace_credentials enable row level security;

-- Create RLS Policies
create policy "Users can view their own credentials"
    on public.marketplace_credentials
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own credentials"
    on public.marketplace_credentials
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own credentials"
    on public.marketplace_credentials
    for update
    using (auth.uid() = user_id);

create policy "Users can delete their own credentials"
    on public.marketplace_credentials
    for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
    before update on public.marketplace_credentials
    for each row
    execute function public.handle_updated_at();
