create table if not exists public.order_pdf_versions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  storage_path text,
  pdf_url text,
  generated_at timestamptz not null default now(),
  generated_by text,
  created_at timestamptz not null default now()
);

create index if not exists order_pdf_versions_order_id_generated_at_idx
  on public.order_pdf_versions (order_id, generated_at desc);

alter table public.order_pdf_versions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'order_pdf_versions'
      and policyname = 'order_pdf_versions_admin_all'
  ) then
    create policy order_pdf_versions_admin_all
      on public.order_pdf_versions
      for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;
