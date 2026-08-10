create table if not exists public.content_brand_profiles (
  id bigint primary key default 1,
  brand_name text not null default 'EPCVINA Solar',
  positioning text not null default 'Gốc thầu MEP 15 năm',
  core_products jsonb not null default '["Solar Home","Hybrid","BESS","Solar C&I","EV Charger","O&M"]'::jsonb,
  core_cta jsonb not null default '["Nhận thiết kế sơ bộ","Tính hệ thống điện mặt trời","Đăng ký khảo sát","Nhận tư vấn"]'::jsonb,
  tone jsonb not null default '["Chuyên gia","Thực tế","Dễ hiểu","Không giật tít","Không spam","Không phóng đại hiệu quả tài chính"]'::jsonb,
  primary_website text not null default 'https://epcvina.com',
  notes text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.content_settings (
  id bigint primary key default 1,
  ai_provider text not null default 'openai',
  api_key text,
  model_name text not null default 'gpt-5.6',
  publish_webhook_url text,
  publish_webhook_secret text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.content_facebook_pages (
  id uuid primary key default gen_random_uuid(),
  page_name text not null,
  page_id text not null unique,
  access_token text not null,
  graph_version text not null default 'v23.0',
  is_default boolean not null default false,
  is_active boolean not null default true,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists content_facebook_pages_default_idx on public.content_facebook_pages (is_default) where is_default;

create table if not exists public.content_facebook_page_members (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.content_facebook_pages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('viewer', 'editor', 'publisher', 'manager')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, user_id)
);

create table if not exists public.content_facebook_publish_logs (
  id uuid primary key default gen_random_uuid(),
  content_post_id uuid references public.content_posts(id) on delete set null,
  content_variant_id uuid references public.content_variants(id) on delete set null,
  page_id uuid references public.content_facebook_pages(id) on delete set null,
  publisher_id uuid references auth.users(id) on delete set null,
  publisher_role text,
  status text not null default 'draft',
  message text,
  external_post_id text,
  response_payload jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.content_brand_profiles (id)
values (1)
on conflict (id) do nothing;

insert into public.content_settings (id)
values (1)
on conflict (id) do nothing;

create table if not exists public.content_posts (
  id uuid primary key default gen_random_uuid(),
  content_id text not null unique,
  slug text not null unique,
  title text not null,
  topic text,
  category text,
  content_type text not null default 'educational' check (content_type in ('educational', 'case_study', 'product', 'calculator', 'faq', 'news', 'project', 'promotion', 'comparison', 'video')),
  target_audience text,
  pain_point text,
  key_message text,
  offer text,
  cta text,
  keywords text[] not null default '{}'::text[],
  reference_urls text[] not null default '{}'::text[],
  desired_channels text[] not null default '{}'::text[],
  image_type text,
  publish_strategy text,
  status text not null default 'draft' check (status in ('draft', 'ai_generated', 'review', 'approved', 'scheduled', 'published', 'failed', 'archived')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  author text,
  excerpt text,
  body text,
  scheduled_at timestamptz,
  published_at timestamptz,
  content_meta jsonb not null default '{}'::jsonb,
  source_system text,
  source_external_id text,
  source_url text,
  source_imported_at timestamptz,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  is_ai_generated boolean not null default false,
  ai_model text,
  ai_prompt text,
  ai_response jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_posts_status_scheduled_idx on public.content_posts (status, scheduled_at desc);
create index if not exists content_posts_created_at_idx on public.content_posts (created_at desc);
create index if not exists content_posts_content_type_idx on public.content_posts (content_type, created_at desc);
create index if not exists content_posts_slug_idx on public.content_posts (slug);

create table if not exists public.content_variants (
  id uuid primary key default gen_random_uuid(),
  content_post_id uuid not null references public.content_posts(id) on delete cascade,
  channel text not null,
  title text,
  hook text,
  body text,
  cta text,
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'scheduled', 'published', 'failed', 'archived')),
  scheduled_at timestamptz,
  published_at timestamptz,
  external_post_id text,
  variant_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_variants_post_channel_idx on public.content_variants (content_post_id, channel);
create index if not exists content_variants_status_scheduled_idx on public.content_variants (status, scheduled_at desc);

alter table public.crm_leads add column if not exists content_id text;
alter table public.crm_leads add column if not exists content_slug text;
create index if not exists crm_leads_content_id_idx on public.crm_leads (content_id);
create index if not exists crm_leads_content_slug_idx on public.crm_leads (content_slug);

alter table public.content_brand_profiles enable row level security;
alter table public.content_settings enable row level security;
alter table public.content_facebook_pages enable row level security;
alter table public.content_facebook_page_members enable row level security;
alter table public.content_facebook_publish_logs enable row level security;
alter table public.content_posts enable row level security;
alter table public.content_variants enable row level security;

revoke all on table public.content_brand_profiles from anon;
revoke all on table public.content_settings from anon;
revoke all on table public.content_facebook_pages from anon;
revoke all on table public.content_facebook_page_members from anon;
revoke all on table public.content_facebook_publish_logs from anon;
revoke all on table public.content_posts from anon;
revoke all on table public.content_variants from anon;

grant select, insert, update, delete on table public.content_brand_profiles to authenticated, service_role;
grant select, insert, update, delete on table public.content_settings to authenticated, service_role;
grant select, insert, update, delete on table public.content_facebook_pages to authenticated, service_role;
grant select, insert, update, delete on table public.content_facebook_page_members to authenticated, service_role;
grant select, insert, update, delete on table public.content_facebook_publish_logs to authenticated, service_role;
grant select, insert, update, delete on table public.content_posts to authenticated, service_role;
grant select, insert, update, delete on table public.content_variants to authenticated, service_role;

drop policy if exists "Content admins can read brand profile" on public.content_brand_profiles;
drop policy if exists "Content admins can manage brand profile" on public.content_brand_profiles;
drop policy if exists "Content admins can read settings" on public.content_settings;
drop policy if exists "Content admins can manage settings" on public.content_settings;
drop policy if exists "Content admins can read facebook pages" on public.content_facebook_pages;
drop policy if exists "Content admins can manage facebook pages" on public.content_facebook_pages;
drop policy if exists "Content admins can read facebook page members" on public.content_facebook_page_members;
drop policy if exists "Content admins can manage facebook page members" on public.content_facebook_page_members;
drop policy if exists "Content admins can read facebook publish logs" on public.content_facebook_publish_logs;
drop policy if exists "Content admins can insert facebook publish logs" on public.content_facebook_publish_logs;
drop policy if exists "Content admins can read posts" on public.content_posts;
drop policy if exists "Content admins can insert posts" on public.content_posts;
drop policy if exists "Content admins can update posts" on public.content_posts;
drop policy if exists "Content admins can delete posts" on public.content_posts;
drop policy if exists "Content admins can read variants" on public.content_variants;
drop policy if exists "Content admins can insert variants" on public.content_variants;
drop policy if exists "Content admins can update variants" on public.content_variants;
drop policy if exists "Content admins can delete variants" on public.content_variants;

create policy "Content admins can read brand profile"
on public.content_brand_profiles for select to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can manage brand profile"
on public.content_brand_profiles for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can read settings"
on public.content_settings for select to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can manage settings"
on public.content_settings for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can read facebook pages"
on public.content_facebook_pages for select to authenticated
using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  or exists (
    select 1
    from public.content_facebook_page_members m
    where m.page_id = id and m.user_id = (select auth.uid())
  )
);

create policy "Content admins can manage facebook pages"
on public.content_facebook_pages for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can read facebook page members"
on public.content_facebook_page_members for select to authenticated
using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  or exists (
    select 1
    from public.content_facebook_page_members own
    where own.page_id = content_facebook_page_members.page_id
      and own.user_id = (select auth.uid())
  )
);

create policy "Content admins can manage facebook page members"
on public.content_facebook_page_members for all to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can read facebook publish logs"
on public.content_facebook_publish_logs for select to authenticated
using (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  or exists (
    select 1
    from public.content_facebook_page_members m
    where m.page_id = content_facebook_publish_logs.page_id
      and m.user_id = (select auth.uid())
  )
);

create policy "Content admins can insert facebook publish logs"
on public.content_facebook_publish_logs for insert to authenticated
with check (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  or exists (
    select 1
    from public.content_facebook_page_members m
    where m.page_id = content_facebook_publish_logs.page_id
      and m.user_id = (select auth.uid())
  )
);

create policy "Content admins can read posts"
on public.content_posts for select to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can insert posts"
on public.content_posts for insert to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can update posts"
on public.content_posts for update to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can delete posts"
on public.content_posts for delete to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can read variants"
on public.content_variants for select to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can insert variants"
on public.content_variants for insert to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can update variants"
on public.content_variants for update to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Content admins can delete variants"
on public.content_variants for delete to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
