alter table public.combo_items
add column if not exists reference_product_id uuid references public.products(id) on delete set null,
add column if not exists sheet_group text,
add column if not exists gross_margin numeric(18,2) not null default 0;

create index if not exists combo_items_reference_product_id_idx on public.combo_items (reference_product_id);
create index if not exists combo_items_sheet_group_idx on public.combo_items (sheet_group);
