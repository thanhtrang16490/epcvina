alter table public.products
add column if not exists cover_image_url text,
add column if not exists image_urls jsonb not null default '[]'::jsonb;

alter table public.combos
add column if not exists cover_image_url text,
add column if not exists image_urls jsonb not null default '[]'::jsonb,
add column if not exists title text,
add column if not exists system_type text,
add column if not exists phase_text text,
add column if not exists voltage text,
add column if not exists power_kw numeric(18,2),
add column if not exists investment_million_vnd numeric(18,2),
add column if not exists production_min_kwh numeric(18,2),
add column if not exists production_max_kwh numeric(18,2),
add column if not exists payback_years numeric(18,2),
add column if not exists payback_label text,
add column if not exists roof_area_m2 numeric(18,2),
add column if not exists combo_group text,
add column if not exists source_file text,
add column if not exists source_kind text;

create table if not exists public.combo_items (
  id uuid primary key default gen_random_uuid(),
  combo_id uuid not null references public.combos(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  item_name text not null,
  category text not null,
  brand text not null,
  unit text not null,
  quantity numeric(18,2) not null default 1,
  unit_price_vat numeric(18,2) not null default 0,
  total_price_vat numeric(18,2) not null default 0,
  cost_price numeric(18,2) not null default 0,
  total_cost_price numeric(18,2) not null default 0,
  warranty text,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
