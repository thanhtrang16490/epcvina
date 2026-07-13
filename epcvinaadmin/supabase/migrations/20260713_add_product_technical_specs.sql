alter table if exists public.products
add column if not exists technical_specs jsonb not null default '{}'::jsonb;
