alter table if exists public.customers
  add column if not exists customer_type text not null default 'contact',
  add column if not exists parent_company_id uuid references public.customers(id) on delete set null,
  add column if not exists province text,
  add column if not exists district text,
  add column if not exists ward text,
  add column if not exists address_detail text,
  add column if not exists billing_name text,
  add column if not exists billing_phone text,
  add column if not exists billing_email text;

update public.customers
set customer_type = case
  when coalesce(tax_code, '') <> '' and coalesce(address, '') <> '' then 'company'
  else 'contact'
end
where customer_type is null;

alter table if exists public.orders
  add column if not exists customer_type text not null default 'contact',
  add column if not exists invoice_customer_id uuid references public.customers(id) on delete set null,
  add column if not exists invoice_contact_id uuid references public.customers(id) on delete set null,
  add column if not exists invoice_name_snapshot text,
  add column if not exists invoice_tax_code_snapshot text,
  add column if not exists invoice_phone_snapshot text,
  add column if not exists invoice_email_snapshot text,
  add column if not exists invoice_address_snapshot text,
  add column if not exists contact_name_snapshot text,
  add column if not exists contact_phone_snapshot text,
  add column if not exists contact_email_snapshot text;

create index if not exists customers_customer_type_idx on public.customers (customer_type);
create index if not exists customers_parent_company_id_idx on public.customers (parent_company_id);
create index if not exists orders_invoice_customer_id_idx on public.orders (invoice_customer_id);
create index if not exists orders_invoice_contact_id_idx on public.orders (invoice_contact_id);
