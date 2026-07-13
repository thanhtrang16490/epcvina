create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  phone text,
  email text,
  tax_code text,
  address text,
  note text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  phone text,
  email text,
  address text,
  contact_name text,
  website text,
  note text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  name text not null,
  code text,
  address text,
  capacity text,
  system_type text,
  completion_date text,
  image_url text,
  gallery_urls jsonb not null default '[]'::jsonb,
  description text,
  source_url text,
  status text not null default 'draft',
  note text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  order_no text,
  order_type text not null default 'combo',
  status text not null default 'draft',
  order_date date,
  note text,
  subtotal numeric(18,2) not null default 0,
  discount numeric(18,2) not null default 0,
  total numeric(18,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  combo_id uuid references public.combos(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  item_name text not null,
  item_type text not null default 'product',
  quantity numeric(18,2) not null default 1,
  unit_price numeric(18,2) not null default 0,
  total_price numeric(18,2) not null default 0,
  note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  supplier_sku text,
  supplier_price numeric(18,2) not null default 0,
  min_order_qty numeric(18,2) not null default 1,
  lead_time_days integer,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_id, product_id)
);

create index if not exists customers_slug_idx on public.customers (slug);
create index if not exists suppliers_slug_idx on public.suppliers (slug);
create index if not exists projects_customer_id_idx on public.projects (customer_id);
create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_project_id_idx on public.orders (project_id);
create index if not exists orders_slug_idx on public.orders (slug);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists supplier_products_supplier_id_idx on public.supplier_products (supplier_id);
create index if not exists supplier_products_product_id_idx on public.supplier_products (product_id);
