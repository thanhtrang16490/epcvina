alter table if exists public.products
  alter column status set default 'active';

update public.products
set status = case
  when coalesce(is_active, true) = true then 'active'
  else 'inactive'
end
where status is null
   or status = ''
   or status in ('draft', 'public', 'archive', 'inactive', 'active');

alter table if exists public.products
  drop constraint if exists products_status_check;

alter table if exists public.products
  add constraint products_status_check
  check (status in ('active', 'inactive'));

update public.products
set is_active = (status = 'active');
