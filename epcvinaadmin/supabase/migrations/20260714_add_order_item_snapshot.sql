alter table public.order_items
add column if not exists snapshot_data jsonb not null default '{}'::jsonb;

create index if not exists order_items_snapshot_data_idx on public.order_items using gin (snapshot_data);
