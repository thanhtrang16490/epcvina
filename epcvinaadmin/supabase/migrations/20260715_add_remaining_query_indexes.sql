create extension if not exists pg_trgm;

create index if not exists orders_order_no_trgm_idx
  on public.orders using gin (order_no gin_trgm_ops);
create index if not exists orders_slug_trgm_idx
  on public.orders using gin (slug gin_trgm_ops);
create index if not exists orders_order_type_created_at_idx
  on public.orders (order_type, created_at desc);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'status'
  ) then
    execute 'create index if not exists orders_status_created_at_idx on public.orders (status, created_at desc)';
  end if;
end $$;

create index if not exists customers_name_trgm_idx
  on public.customers using gin (name gin_trgm_ops);
create index if not exists customers_phone_trgm_idx
  on public.customers using gin (phone gin_trgm_ops);
create index if not exists customers_email_trgm_idx
  on public.customers using gin (email gin_trgm_ops);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'customers'
      and column_name = 'status'
  ) then
    execute 'create index if not exists customers_status_sort_order_idx on public.customers (status, sort_order)';
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'status'
  ) then
    execute 'create index if not exists projects_status_created_at_idx on public.projects (status, created_at desc)';
  end if;
end $$;

create index if not exists projects_name_trgm_idx
  on public.projects using gin (name gin_trgm_ops);

create index if not exists products_name_trgm_idx
  on public.products using gin (name gin_trgm_ops);
create index if not exists products_slug_trgm_idx
  on public.products using gin (slug gin_trgm_ops);
create index if not exists products_brand_trgm_idx
  on public.products using gin (brand gin_trgm_ops);
create index if not exists products_category_trgm_idx
  on public.products using gin (category gin_trgm_ops);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'status'
  ) then
    execute 'create index if not exists products_status_is_active_sort_order_idx on public.products (status, is_active, sort_order)';
  end if;
end $$;

create index if not exists combos_code_trgm_idx
  on public.combos using gin (code gin_trgm_ops);
create index if not exists combos_name_trgm_idx
  on public.combos using gin (name gin_trgm_ops);
create index if not exists combos_description_trgm_idx
  on public.combos using gin (description gin_trgm_ops);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'combos'
      and column_name = 'status'
  ) then
    execute 'create index if not exists combos_status_is_active_sort_order_idx on public.combos (status, is_active, sort_order)';
  end if;
end $$;

