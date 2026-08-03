// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'sale' | 'admin' | 'sale_admin' | 'warehouse' | 'accountant' | 'director'

export interface User {
  id: string
  email?: string
  phone?: string
  full_name?: string
  role: UserRole
}

// ─── Customer ────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  full_name?: string
  phone?: string
  email?: string
  address?: string
  assigned_to?: string
  user_id?: string
  created_at: string
  updated_at: string
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  code?: string
  description?: string
  price: number
  stock: number
  category_id?: string
  category?: string
  image_url?: string
  unit?: string
  specifications?: string
  created_at: string
  deleted_at?: string | null
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'draft'
  | 'ordered'
  | 'shipping'
  | 'paid'
  | 'completed'
  | 'cancelled'

export interface Order {
  id: string
  customer_id?: string
  customer_name?: string
  sale_id?: string
  total_amount: number
  status: OrderStatus
  items?: OrderItem[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  price_at_order?: number
  subtotal: number
}

// ─── Team ────────────────────────────────────────────────────────────────────

export interface SalesTeam {
  id: string
  name: string
  manager_id: string
  created_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  sale_id: string
  status: 'active' | 'inactive'
  joined_at: string
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  orderedCount: number
  lowStockCount: number
  customerCount: number
  totalRevenue: number
}

export interface TeamStats {
  teamMembers: number
  teamCustomers: number
  teamOrders: number
  teamRevenue: number
}

// ─── Notification ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: 'order' | 'system' | 'alert'
  read: boolean
  data?: Record<string, unknown>
  created_at: string
}

// ─── Discount & Gift ─────────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'fixed'

export interface DiscountPolicy {
  id: string
  name: string
  customer_id?: string | null
  product_group?: string | null
  region?: string | null
  discount_type: DiscountType
  discount_value: number
  effective_from: string | null
  effective_to: string | null
  is_active: boolean
  notes?: string | null
  created_by?: string | null
  created_at: string
}

export interface GiftPolicy {
  id: string
  name: string
  trigger_product_id: number | null
  min_quantity: number | null
  gift_product_id: number | null
  gift_quantity: number | null
  is_active: boolean
  effective_from: string | null
  effective_to: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  trigger_product?: { id: number; name: string; code: string } | null
  gift_product?: { id: number; name: string; code: string; price: number; unit: string } | null
}

export interface GiftItem {
  policy_id: string | null
  policy_name: string
  product_id: string
  product_name: string
  product_code: string
  quantity: number
  unit_value: number
  unit?: string
  auto: boolean
}

export interface CustomerSpecialPrice {
  id: number
  customer_id: string
  product_id: number
  price_type: 'fixed' | 'percentage'
  price_value: number
  effective_from: string
  effective_to: string | null
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  notes: string | null
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  pagination?: PaginationMeta
}
