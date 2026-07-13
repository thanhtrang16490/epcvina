alter table if exists public.customers
  add column if not exists status text not null default 'active';

update public.customers
set status = case
  when coalesce(is_active, true) = true then 'active'
  else 'inactive'
end
where status is null
   or status = ''
   or status in ('draft', 'public', 'archive', 'inactive', 'active');

alter table if exists public.customers
  drop constraint if exists customers_status_check;

alter table if exists public.customers
  add constraint customers_status_check
  check (status in ('active', 'inactive'));

update public.customers
set is_active = (status = 'active');
