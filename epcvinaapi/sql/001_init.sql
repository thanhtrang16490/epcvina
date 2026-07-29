create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  customer_type text not null default 'contact',
  parent_company_id uuid null references customers(id) on delete set null,
  name text not null,
  phone text null,
  email text null,
  tax_code text null,
  province text null,
  district text null,
  ward text null,
  address_detail text null,
  address text null,
  billing_name text null,
  billing_phone text null,
  billing_email text null,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_customers_parent_company_id on customers(parent_company_id);
create index if not exists idx_customers_customer_type on customers(customer_type);
create index if not exists idx_customers_name on customers using gin (to_tsvector('simple', coalesce(name, '')));

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text null,
  customer_id uuid not null references customers(id) on delete cascade,
  name text not null,
  address text null,
  status text not null default 'inactive',
  sort_order integer not null default 0,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_projects_customer_id on projects(customer_id);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  phone text null,
  email text null,
  tax_code text null,
  address text null,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sku text null,
  brand_name text null,
  category text null,
  unit text null default 'Cái',
  cost_price numeric(18,2) not null default 0,
  sale_price numeric(18,2) not null default 0,
  vat_rate numeric(5,2) not null default 10,
  status text not null default 'active',
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_products_name on products using gin (to_tsvector('simple', coalesce(name, '')));

create table if not exists combos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  code text null,
  combo_type text not null default 'hybrid',
  phase_type text not null default '1pha',
  status text not null default 'draft',
  total_sale_price numeric(18,2) not null default 0,
  total_cost_price numeric(18,2) not null default 0,
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists combo_items (
  id uuid primary key default gen_random_uuid(),
  combo_id uuid not null references combos(id) on delete cascade,
  product_id uuid null references products(id) on delete set null,
  reference_product_id uuid null references products(id) on delete set null,
  no integer not null,
  category text not null,
  specification text not null,
  brand_name text null,
  unit text not null default 'Cái',
  quantity numeric(18,2) not null default 1,
  unit_price_vat numeric(18,2) not null default 0,
  warranty text null,
  cost_price numeric(18,2) not null default 0,
  gross_margin numeric(18,2) not null default 0,
  notes text null
);
create index if not exists idx_combo_items_combo_id on combo_items(combo_id);

create table if not exists pricing_layers (
  id uuid primary key default gen_random_uuid(),
  combo_id uuid not null references combos(id) on delete cascade,
  label text not null,
  min_qty integer not null default 1,
  max_qty integer null,
  sale_price numeric(18,2) not null default 0,
  cost_price numeric(18,2) not null default 0,
  note text null
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_id uuid not null references customers(id) on delete restrict,
  project_id uuid null references projects(id) on delete set null,
  invoice_customer_id uuid null references customers(id) on delete set null,
  invoice_contact_id uuid null references customers(id) on delete set null,
  status text not null default 'new',
  note text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_orders_customer_id on orders(customer_id);
create index if not exists idx_orders_project_id on orders(project_id);
