import { useSupabaseQuery } from './useSupabaseQuery'
import { useAuth } from '../contexts/AuthContext'

export function useOrders(status?: string) {
  const { user } = useAuth()

  const filters: Record<string, any> = {
    customer_id: user?.id,
  }

  if (status) {
    filters.status = status
  }

  return useSupabaseQuery({
    table: 'orders',
    select: '*',
    filters,
    orderBy: { column: 'created_at', ascending: false },
    cacheKey: status ? `orders_${status}_${user?.id}` : `orders_all_${user?.id}`,
  })
}

export function useSalesOrders(userId: string, role: string, status?: string) {
  const filters: Record<string, any> = {}

  // Role-based filtering
  if (role === 'sale') {
    filters.sale_id = userId
  }
  // Sale Admin and Admin see all orders (no filter)

  if (status) {
    filters.status = status
  }

  return useSupabaseQuery({
    table: 'orders',
    select: '*',
    filters,
    orderBy: { column: 'created_at', ascending: false },
    cacheKey: status ? `sales_orders_${status}_${userId}` : `sales_orders_all_${userId}`,
  })
}
