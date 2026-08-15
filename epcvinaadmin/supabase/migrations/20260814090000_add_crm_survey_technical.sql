create table if not exists public.crm_survey_technical (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  house_direction text,
  house_direction_label text,
  roof_direction text,
  roof_direction_label text,
  roof_slope text,
  shadow_obstacles text,
  installation_areas text,
  string_count text,
  structure_type text,
  roof_material text,
  roof_condition text,
  building_height text,
  access_notes text,
  inverter_location text,
  distribution_board_location text,
  main_switchboard_location text,
  main_breaker_rating text,
  meter_location text,
  wifi_signal text,
  safety_access_notes text,
  cable_route text,
  distance_to_grid_point text,
  dc_cable_length text,
  ac_cable_length text,
  house_direction_image_urls jsonb not null default '[]'::jsonb,
  house_direction_image_paths jsonb not null default '[]'::jsonb,
  roof_direction_image_urls jsonb not null default '[]'::jsonb,
  roof_direction_image_paths jsonb not null default '[]'::jsonb,
  need_frame boolean not null default false,
  frame_notes text,
  site_images jsonb not null default '[]'::jsonb,
  sketch_images jsonb not null default '[]'::jsonb,
  site_image_paths jsonb not null default '[]'::jsonb,
  sketch_image_paths jsonb not null default '[]'::jsonb,
  youtube_video_url text,
  notes text,
  surveyed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_survey_technical_lead_id_idx on public.crm_survey_technical (lead_id);
create index if not exists crm_survey_technical_surveyed_at_idx on public.crm_survey_technical (surveyed_at desc);

alter table public.crm_survey_technical
  add column if not exists roof_material text,
  add column if not exists roof_condition text,
  add column if not exists building_height text,
  add column if not exists access_notes text,
  add column if not exists main_switchboard_location text,
  add column if not exists main_breaker_rating text,
  add column if not exists meter_location text,
  add column if not exists wifi_signal text,
  add column if not exists safety_access_notes text;

alter table public.crm_survey_technical enable row level security;

revoke all on table public.crm_survey_technical from anon;
grant select, insert, update, delete on table public.crm_survey_technical to authenticated, service_role;

drop policy if exists "CRM admins can read technical surveys" on public.crm_survey_technical;
drop policy if exists "CRM admins can insert technical surveys" on public.crm_survey_technical;
drop policy if exists "CRM admins can update technical surveys" on public.crm_survey_technical;
drop policy if exists "CRM admins can delete technical surveys" on public.crm_survey_technical;

create policy "CRM admins can read technical surveys"
on public.crm_survey_technical for select to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "CRM admins can insert technical surveys"
on public.crm_survey_technical for insert to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "CRM admins can update technical surveys"
on public.crm_survey_technical for update to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "CRM admins can delete technical surveys"
on public.crm_survey_technical for delete to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
