create table if not exists public.pricing_settings (
  id smallint primary key default 1,
  labor_ongrid_per_kwp numeric not null default 500000,
  labor_hybrid_per_kwp numeric not null default 900000,
  target_gross_margin_pct numeric not null default 20,
  default_psh_hours numeric not null default 4,
  default_pr numeric not null default 0.8,
  self_use_ratio numeric not null default 0.8,
  electricity_price_vnd_per_kwh numeric not null default 3200,
  feed_in_tariff_vnd_per_kwh numeric not null default 1700,
  updated_at timestamptz not null default now()
);

insert into public.pricing_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.pricing_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'pricing_settings'
      and policyname = 'pricing_settings_select_all'
  ) then
    create policy pricing_settings_select_all
      on public.pricing_settings
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'pricing_settings'
      and policyname = 'pricing_settings_manage_all'
  ) then
    create policy pricing_settings_manage_all
      on public.pricing_settings
      for all
      using (true)
      with check (true);
  end if;
end $$;
