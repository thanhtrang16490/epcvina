insert into storage.buckets (id, name, public)
values ('catalog-media', 'catalog-media', true)
on conflict (id) do update
set public = true;

drop policy if exists "catalog-media-public-read" on storage.objects;
drop policy if exists "catalog-media-auth-write" on storage.objects;
drop policy if exists "catalog-media-auth-update" on storage.objects;
drop policy if exists "catalog-media-auth-delete" on storage.objects;

create policy "catalog-media-public-read"
on storage.objects for select
using (bucket_id = 'catalog-media');

create policy "catalog-media-auth-write"
on storage.objects for insert
with check (bucket_id = 'catalog-media');

create policy "catalog-media-auth-update"
on storage.objects for update
using (bucket_id = 'catalog-media')
with check (bucket_id = 'catalog-media');

create policy "catalog-media-auth-delete"
on storage.objects for delete
using (bucket_id = 'catalog-media');
