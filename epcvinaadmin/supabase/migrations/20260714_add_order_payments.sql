create table if not exists public.order_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  payment_no text,
  payment_type text not null default 'manual',
  payment_stage text,
  payment_date date not null default current_date,
  amount numeric(18,2) not null default 0,
  payment_method text,
  transaction_id text,
  status text not null default 'completed',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists order_payments_order_id_idx on public.order_payments (order_id);
create index if not exists order_payments_payment_date_idx on public.order_payments (payment_date);
create index if not exists order_payments_status_idx on public.order_payments (status);
