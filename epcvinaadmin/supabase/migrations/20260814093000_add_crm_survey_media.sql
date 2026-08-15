insert into storage.buckets (id, name, public)
values ('survey-media', 'survey-media', true)
on conflict (id) do update
set public = true;

drop policy if exists "survey-media-public-read" on storage.objects;
drop policy if exists "survey-media-auth-write" on storage.objects;
drop policy if exists "survey-media-auth-update" on storage.objects;
drop policy if exists "survey-media-auth-delete" on storage.objects;

create policy "survey-media-public-read"
on storage.objects for select
using (bucket_id = 'survey-media');

create policy "survey-media-auth-write"
on storage.objects for insert
with check (bucket_id = 'survey-media');

create policy "survey-media-auth-update"
on storage.objects for update
using (bucket_id = 'survey-media')
with check (bucket_id = 'survey-media');

create policy "survey-media-auth-delete"
on storage.objects for delete
using (bucket_id = 'survey-media');

alter table public.crm_survey_technical
  add column if not exists site_image_paths jsonb not null default '[]'::jsonb,
  add column if not exists sketch_image_paths jsonb not null default '[]'::jsonb,
  add column if not exists youtube_video_url text;
