create index if not exists brands_sort_order_idx on public.brands (sort_order);
create index if not exists combo_categories_sort_order_idx on public.combo_categories (sort_order);
create index if not exists product_categories_sort_order_idx on public.product_categories (sort_order);
create index if not exists customers_sort_order_idx on public.customers (sort_order);
create index if not exists projects_sort_order_idx on public.projects (sort_order);
create index if not exists suppliers_sort_order_idx on public.suppliers (sort_order);
create index if not exists combos_sort_order_idx on public.combos (sort_order);
create index if not exists products_sort_order_idx on public.products (sort_order);
create index if not exists discounts_sort_order_idx on public.discounts (sort_order);
create index if not exists payment_policies_sort_order_idx on public.payment_policies (sort_order);

create index if not exists customers_customer_type_parent_company_sort_order_idx
  on public.customers (customer_type, parent_company_id, sort_order);
create index if not exists projects_customer_id_sort_order_idx
  on public.projects (customer_id, sort_order);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_customer_id_created_at_idx on public.orders (customer_id, created_at desc);
create index if not exists orders_project_id_created_at_idx on public.orders (project_id, created_at desc);
create index if not exists orders_invoice_customer_id_created_at_idx on public.orders (invoice_customer_id, created_at desc);
create index if not exists orders_invoice_contact_id_created_at_idx on public.orders (invoice_contact_id, created_at desc);
create index if not exists combo_items_combo_id_sort_order_idx on public.combo_items (combo_id, sort_order);
create index if not exists products_brand_id_sort_order_idx on public.products (brand_id, sort_order);
create index if not exists products_category_id_sort_order_idx on public.products (category_id, sort_order);
create index if not exists combos_combo_category_id_sort_order_idx on public.combos (combo_category_id, sort_order);
create index if not exists supplier_products_supplier_id_created_at_idx on public.supplier_products (supplier_id, created_at desc);
create index if not exists supplier_products_product_id_created_at_idx on public.supplier_products (product_id, created_at desc);
