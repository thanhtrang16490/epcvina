alter table if exists public.brands
add column if not exists logo_url text,
add column if not exists image_url text;

alter table if exists public.product_categories
add column if not exists image_url text;

alter table if exists public.combo_categories
add column if not exists image_url text;
