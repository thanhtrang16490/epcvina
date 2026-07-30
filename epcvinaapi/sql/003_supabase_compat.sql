create extension if not exists pgcrypto;

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text null,
  image_url text null,
  logo_url text null,
  status text not null default 'active',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text null,
  image_url text null,
  parent_id uuid null references product_categories(id) on delete set null,
  status text not null default 'active',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists combo_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text null,
  image_url text null,
  status text not null default 'active',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists discounts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  discount_type text not null default 'fixed',
  value numeric(18,2) not null default 0,
  description text null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payment_policies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  policy_code text not null default 'default',
  deposit_percent numeric(5,2) not null default 30,
  delivery_percent numeric(5,2) not null default 60,
  acceptance_percent numeric(5,2) not null default 10,
  description text null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pricing_settings (
  id smallint primary key default 1,
  labor_ongrid_per_kwp numeric not null default 500000,
  labor_hybrid_per_kwp numeric not null default 900000,
  target_gross_margin_pct numeric not null default 20,
  default_psh_hours numeric not null default 4,
  default_pr numeric not null default 0.8,
  self_use_ratio numeric not null default 0.8,
  residential_electricity_price_vnd_per_kwh numeric not null default 2204,
  commercial_electricity_price_vnd_per_kwh numeric not null default 2500,
  electricity_price_vnd_per_kwh numeric not null default 3200,
  feed_in_tariff_vnd_per_kwh numeric not null default 1700,
  updated_at timestamptz not null default now()
);

insert into pricing_settings (id)
values (1)
on conflict (id) do nothing;

alter table if exists products
  add column if not exists technical_specs jsonb not null default '{}'::jsonb,
  add column if not exists category_id uuid null references product_categories(id) on delete set null,
  add column if not exists brand_id uuid null references brands(id) on delete set null,
  add column if not exists cover_image_url text null,
  add column if not exists image_urls jsonb not null default '[]'::jsonb,
  add column if not exists quantity numeric(18,2) not null default 1,
  add column if not exists warranty text null,
  add column if not exists description text null,
  add column if not exists is_active boolean not null default true,
  add column if not exists sort_order integer not null default 0;

alter table if exists combos
  add column if not exists phase integer not null default 1,
  add column if not exists solar_kw numeric(18,2) not null default 0,
  add column if not exists battery_kwh numeric(18,2) null,
  add column if not exists battery_type text null,
  add column if not exists target_min_price numeric(18,2) not null default 0,
  add column if not exists reference_price numeric(18,2) not null default 0,
  add column if not exists combo_category_id uuid null references combo_categories(id) on delete set null,
  add column if not exists cover_image_url text null,
  add column if not exists image_urls jsonb not null default '[]'::jsonb,
  add column if not exists source_kind text not null default 'manual';

alter table if exists combo_items
  add column if not exists item_name text null,
  add column if not exists brand text null,
  add column if not exists unit_price_vat numeric(18,2) not null default 0,
  add column if not exists total_price_vat numeric(18,2) not null default 0,
  add column if not exists total_cost_price numeric(18,2) not null default 0,
  add column if not exists sheet_group text null,
  add column if not exists sort_order integer not null default 0,
  add column if not exists notes text null,
  add column if not exists source_sheet text null;

alter table if exists orders
  add column if not exists slug text unique,
  add column if not exists order_no text,
  add column if not exists order_type text not null default 'combo',
  add column if not exists order_date date null,
  add column if not exists subtotal numeric(18,2) not null default 0,
  add column if not exists discount numeric(18,2) not null default 0,
  add column if not exists total numeric(18,2) not null default 0,
  add column if not exists payment_method text null,
  add column if not exists discount_id uuid null references discounts(id) on delete set null,
  add column if not exists discount_name text null,
  add column if not exists discount_type text null,
  add column if not exists discount_value numeric(18,2) null,
  add column if not exists payment_policy_id uuid null references payment_policies(id) on delete set null,
  add column if not exists payment_policy_name text null,
  add column if not exists payment_policy_code text null,
  add column if not exists payment_policy_deposit_percent numeric(5,2) null,
  add column if not exists payment_policy_delivery_percent numeric(5,2) null,
  add column if not exists payment_policy_acceptance_percent numeric(5,2) null,
  add column if not exists deposit_amount numeric(18,2) null,
  add column if not exists delivery_amount numeric(18,2) null,
  add column if not exists acceptance_amount numeric(18,2) null,
  add column if not exists pdf_generated_at timestamptz null,
  add column if not exists pdf_url text null,
  add column if not exists customer_type text null,
  add column if not exists invoice_name_snapshot text null,
  add column if not exists invoice_tax_code_snapshot text null,
  add column if not exists invoice_phone_snapshot text null,
  add column if not exists invoice_email_snapshot text null,
  add column if not exists invoice_address_snapshot text null,
  add column if not exists contact_name_snapshot text null,
  add column if not exists contact_phone_snapshot text null,
  add column if not exists contact_email_snapshot text null;

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  combo_id uuid null references combos(id) on delete set null,
  product_id uuid null references products(id) on delete set null,
  item_name text not null,
  item_type text not null default 'product',
  quantity numeric(18,2) not null default 1,
  unit_price numeric(18,2) not null default 0,
  total_price numeric(18,2) not null default 0,
  note text null,
  sort_order integer not null default 0,
  snapshot_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists combo_items
  alter column no drop not null;

alter table if exists orders
  alter column code drop not null;

alter table if exists order_pdf_versions
  alter column file_path drop not null;

alter table if exists order_items
  add column if not exists combo_id uuid null references combos(id) on delete set null,
  add column if not exists product_id uuid null references products(id) on delete set null,
  add column if not exists item_name text not null default '',
  add column if not exists item_type text not null default 'product',
  add column if not exists quantity numeric(18,2) not null default 1,
  add column if not exists unit_price numeric(18,2) not null default 0,
  add column if not exists total_price numeric(18,2) not null default 0,
  add column if not exists note text null,
  add column if not exists sort_order integer not null default 0,
  add column if not exists snapshot_data jsonb not null default '{}'::jsonb;

create table if not exists order_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  payment_date timestamptz not null default now(),
  payment_method text not null default 'cash',
  amount numeric(18,2) not null default 0,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_pdf_versions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  version integer not null default 1,
  file_path text not null,
  file_url text null,
  created_at timestamptz not null default now()
);

create table if not exists supplier_products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references suppliers(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  supplier_sku text null,
  supplier_price numeric(18,2) not null default 0,
  min_order_qty numeric(18,2) not null default 1,
  lead_time_days integer null,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_id, product_id)
);
