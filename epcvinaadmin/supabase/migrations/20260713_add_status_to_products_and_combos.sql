alter table if exists public.products
add column if not exists status text not null default 'draft';

alter table if exists public.combos
add column if not exists status text not null default 'draft';

update public.products
set status = case
  when coalesce(is_active, true) = true then 'public'
  else 'archive'
end
where status is null or status = '';

update public.combos
set status = case
  when coalesce(is_active, true) = true then 'public'
  else 'archive'
end
where status is null or status = '';
