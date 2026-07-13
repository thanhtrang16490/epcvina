alter table if exists public.combos
  alter column status set default 'active';

update public.combos
set status = case
  when coalesce(is_active, true) = true then 'active'
  else 'inactive'
end
where status is null
   or status = ''
   or status in ('draft', 'public', 'archive', 'inactive', 'active');

alter table if exists public.combos
  drop constraint if exists combos_status_check;

alter table if exists public.combos
  add constraint combos_status_check
  check (status in ('active', 'inactive'));

update public.combos
set is_active = (status = 'active');
