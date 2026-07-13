alter table if exists public.orders
add column if not exists pdf_url text;

alter table if exists public.orders
add column if not exists pdf_storage_path text;

alter table if exists public.orders
add column if not exists pdf_generated_at timestamptz;
