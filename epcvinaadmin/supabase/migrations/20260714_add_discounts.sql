create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  discount_type text not null default 'fixed',
  value numeric(18,2) not null default 0,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.orders
add column if not exists discount_id uuid references public.discounts(id) on delete set null,
add column if not exists discount_name text,
add column if not exists discount_type text,
add column if not exists discount_value numeric(18,2);

create index if not exists discounts_slug_idx on public.discounts (slug);
create index if not exists discounts_is_active_idx on public.discounts (is_active);
create index if not exists orders_discount_id_idx on public.orders (discount_id);

insert into public.discounts (slug, name, discount_type, value, description, is_active, sort_order)
values
  ('ck-3', 'Chiết khấu 3 triệu', 'fixed', 3000000, 'Ưu đãi tiền mặt 3 triệu cho đơn mới', true, 10),
  ('ck-5pct', 'Chiết khấu 5%', 'percent', 5, 'Giảm 5% trên tổng trước chiết khấu', true, 20),
  ('ck-project', 'Chiết khấu dự án', 'fixed', 5000000, 'Áp cho dự án lớn hoặc khách hàng thân thiết', true, 30),
  ('ck-partner', 'Ưu đãi đối tác', 'percent', 7.5, 'Ưu đãi linh hoạt cho đối tác/đại lý', true, 40)
on conflict (slug) do nothing;

create table if not exists public.payment_policies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  policy_code text not null default '3:6:1',
  deposit_percent numeric(5,2) not null default 30,
  delivery_percent numeric(5,2) not null default 60,
  acceptance_percent numeric(5,2) not null default 10,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.orders
add column if not exists payment_policy_id uuid references public.payment_policies(id) on delete set null,
add column if not exists payment_policy_name text,
add column if not exists payment_policy_code text,
add column if not exists payment_policy_deposit_percent numeric(5,2),
add column if not exists payment_policy_delivery_percent numeric(5,2),
add column if not exists payment_policy_acceptance_percent numeric(5,2),
add column if not exists deposit_amount numeric(18,2),
add column if not exists delivery_amount numeric(18,2),
add column if not exists acceptance_amount numeric(18,2);

create index if not exists payment_policies_slug_idx on public.payment_policies (slug);
create index if not exists payment_policies_is_active_idx on public.payment_policies (is_active);
create index if not exists orders_payment_policy_id_idx on public.orders (payment_policy_id);

insert into public.payment_policies (slug, name, policy_code, deposit_percent, delivery_percent, acceptance_percent, description, is_active, sort_order)
values
  ('policy-3-6-1', 'Chính sách 3:6:1', '3:6:1', 30, 60, 10, 'Đặt cọc 30%, thanh toán 60% khi tập kết vật tư, 10% khi nghiệm thu', true, 10),
  ('policy-4-5-1', 'Chính sách 4:5:1', '4:5:1', 40, 50, 10, 'Đặt cọc 40%, thanh toán 50% khi tập kết vật tư, 10% khi nghiệm thu', true, 20),
  ('policy-5-4-1', 'Chính sách 5:4:1', '5:4:1', 50, 40, 10, 'Đặt cọc 50%, thanh toán 40% khi tập kết vật tư, 10% khi nghiệm thu', true, 30)
on conflict (slug) do nothing;
