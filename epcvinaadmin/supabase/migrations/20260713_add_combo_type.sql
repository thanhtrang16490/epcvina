alter table if exists public.combos
add column if not exists combo_type text not null default 'standard';

alter table if exists public.combos
add column if not exists source_kind text;

update public.combos
set combo_type = case
  when coalesce(source_kind, '') = 'project' then 'custom'
  else coalesce(combo_type, 'standard')
end
where combo_type is null or combo_type = '';
