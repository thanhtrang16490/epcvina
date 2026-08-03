create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text not null,
  email text,
  address text,
  message text,
  source text not null default 'epcvinasolar',
  source_form text not null default 'website',
  landing_page text,
  referrer text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'survey_scheduled', 'quoted', 'won', 'lost', 'spam')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid references auth.users(id) on delete set null,
  system_type text,
  roof_area text,
  monthly_bill text,
  system_size_kw numeric(10,3),
  calculator_result jsonb not null default '{}'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  gbraid text,
  wbraid text,
  fbclid text,
  first_contacted_at timestamptz,
  last_contacted_at timestamptz,
  follow_up_at timestamptz,
  lost_reason text,
  internal_note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_leads_created_at_idx on public.crm_leads (created_at desc);
create index if not exists crm_leads_status_created_at_idx on public.crm_leads (status, created_at desc);
create index if not exists crm_leads_phone_idx on public.crm_leads (phone);
create index if not exists crm_leads_source_form_idx on public.crm_leads (source_form, created_at desc);
create index if not exists crm_leads_follow_up_at_idx on public.crm_leads (follow_up_at) where follow_up_at is not null;

alter table public.crm_leads enable row level security;

revoke all on table public.crm_leads from anon;
grant select, insert, update, delete on table public.crm_leads to authenticated, service_role;

drop policy if exists "CRM admins can read leads" on public.crm_leads;
drop policy if exists "CRM admins can insert leads" on public.crm_leads;
drop policy if exists "CRM admins can update leads" on public.crm_leads;
drop policy if exists "CRM admins can delete leads" on public.crm_leads;

create policy "CRM admins can read leads"
on public.crm_leads for select to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "CRM admins can insert leads"
on public.crm_leads for insert to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "CRM admins can update leads"
on public.crm_leads for update to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "CRM admins can delete leads"
on public.crm_leads for delete to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
