-- Ensure API roles can reach exposed tables, then rely on RLS policies for row access.
grant select, insert, update, delete on table public.customers to authenticated, service_role;
grant select, insert, update, delete on table public.suppliers to authenticated, service_role;
grant select, insert, update, delete on table public.projects to authenticated, service_role;
grant select, insert, update, delete on table public.orders to authenticated, service_role;
grant select, insert, update, delete on table public.order_items to authenticated, service_role;
grant select, insert, update, delete on table public.supplier_products to authenticated, service_role;

grant select on table public.products to anon, authenticated, service_role;
grant select on table public.combos to anon, authenticated, service_role;
grant select on table public.brands to anon, authenticated, service_role;
grant select on table public.product_categories to anon, authenticated, service_role;
grant select on table public.combo_categories to anon, authenticated, service_role;

alter table public.customers enable row level security;
alter table public.suppliers enable row level security;
alter table public.projects enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.supplier_products enable row level security;
alter table public.products enable row level security;
alter table public.combos enable row level security;
alter table public.brands enable row level security;
alter table public.product_categories enable row level security;
alter table public.combo_categories enable row level security;

drop policy if exists "CRM authenticated read customers" on public.customers;
drop policy if exists "CRM authenticated manage customers" on public.customers;
drop policy if exists "CRM authenticated read suppliers" on public.suppliers;
drop policy if exists "CRM authenticated manage suppliers" on public.suppliers;
drop policy if exists "CRM authenticated read projects" on public.projects;
drop policy if exists "CRM authenticated manage projects" on public.projects;
drop policy if exists "CRM authenticated read orders" on public.orders;
drop policy if exists "CRM authenticated manage orders" on public.orders;
drop policy if exists "CRM authenticated read order items" on public.order_items;
drop policy if exists "CRM authenticated manage order items" on public.order_items;
drop policy if exists "CRM authenticated read supplier products" on public.supplier_products;
drop policy if exists "CRM authenticated manage supplier products" on public.supplier_products;

drop policy if exists "Public can read products" on public.products;
drop policy if exists "Public can read combos" on public.combos;
drop policy if exists "Public can read brands" on public.brands;
drop policy if exists "Public can read product categories" on public.product_categories;
drop policy if exists "Public can read combo categories" on public.combo_categories;

create policy "CRM authenticated read customers"
on public.customers
for select
to authenticated
using (true);

create policy "CRM authenticated manage customers"
on public.customers
for all
to authenticated
using (true)
with check (true);

create policy "CRM authenticated read suppliers"
on public.suppliers
for select
to authenticated
using (true);

create policy "CRM authenticated manage suppliers"
on public.suppliers
for all
to authenticated
using (true)
with check (true);

create policy "CRM authenticated read projects"
on public.projects
for select
to authenticated
using (true);

create policy "CRM authenticated manage projects"
on public.projects
for all
to authenticated
using (true)
with check (true);

create policy "CRM authenticated read orders"
on public.orders
for select
to authenticated
using (true);

create policy "CRM authenticated manage orders"
on public.orders
for all
to authenticated
using (true)
with check (true);

create policy "CRM authenticated read order items"
on public.order_items
for select
to authenticated
using (true);

create policy "CRM authenticated manage order items"
on public.order_items
for all
to authenticated
using (true)
with check (true);

create policy "CRM authenticated read supplier products"
on public.supplier_products
for select
to authenticated
using (true);

create policy "CRM authenticated manage supplier products"
on public.supplier_products
for all
to authenticated
using (true)
with check (true);

create policy "Public can read products"
on public.products
for select
to anon, authenticated
using (status = 'public' and coalesce(is_active, true) = true);

create policy "Public can read combos"
on public.combos
for select
to anon, authenticated
using (status = 'public' and coalesce(is_active, true) = true);

create policy "Public can read brands"
on public.brands
for select
to anon, authenticated
using (coalesce(is_active, true) = true);

create policy "Public can read product categories"
on public.product_categories
for select
to anon, authenticated
using (coalesce(is_active, true) = true);

create policy "Public can read combo categories"
on public.combo_categories
for select
to anon, authenticated
using (coalesce(is_active, true) = true);
