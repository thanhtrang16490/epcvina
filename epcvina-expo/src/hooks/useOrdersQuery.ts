/**
 * useOrdersQuery - React Query hooks cho Orders
 * Thay thế manual useEffect/useState trong orders/index.tsx
 *
 * Features:
 * - Caching tự động (staleTime 1 phút)
 * - Optimistic updates khi đổi trạng thái
 * - Background refetch khi focus
 * - Deduplication requests
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { errorTracker } from '../lib/error-tracking'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const orderKeys = {
  all: ['orders'] as const,
  list: (userId: string, scope: string) => ['orders', 'list', userId, scope] as const,
  detail: (id: string | number) => ['orders', 'detail', String(id)] as const,
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderWithRelations {
  id: number
  status: string
  total_amount: number
  created_at: string
  sale_id: string
  customer_id?: string
  notes?: string
  customer?: { name?: string; phone?: string } | null
  sale?: { full_name?: string } | null
}

// ─── Fetch Functions ──────────────────────────────────────────────────────────

async function fetchOrders(
  userId: string,
  role: string,
  scope: 'my' | 'team',
  teamMemberIds: string[]
): Promise<OrderWithRelations[]> {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (scope === 'my') {
    query = query.eq('sale_id', userId)
  } else if (scope === 'team' && teamMemberIds.length > 0) {
    query = query.in('sale_id', teamMemberIds)
  }

  const { data, error } = await query
  if (error) throw error
  if (!data || data.length === 0) return []

  // Fetch customer & sale profiles
  const customerIds = [...new Set(data.map((o: any) => o.customer_id).filter(Boolean))]
  const saleIds = [...new Set(data.map((o: any) => o.sale_id).filter(Boolean))]
  const allIds = [...new Set([...customerIds, ...saleIds])]

  let profilesMap: Record<string, any> = {}
  if (allIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role')
      .in('id', allIds)
    profiles?.forEach((p: any) => { profilesMap[p.id] = p })
  }

  return data.map((order: any) => ({
    ...order,
    customer: order.customer_id ? {
      name: profilesMap[order.customer_id]?.full_name,
      phone: profilesMap[order.customer_id]?.phone,
    } : null,
    sale: order.sale_id ? {
      full_name: profilesMap[order.sale_id]?.full_name,
    } : null,
  }))
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

interface UseOrdersListOptions {
  userId: string
  role: string
  scope: 'my' | 'team'
  teamMemberIds: string[]
  enabled?: boolean
}

/**
 * Hook để fetch danh sách orders với React Query
 */
export function useOrdersList({
  userId,
  role,
  scope,
  teamMemberIds,
  enabled = true,
}: UseOrdersListOptions) {
  return useQuery<OrderWithRelations[]>({
    queryKey: orderKeys.list(userId, scope),
    queryFn: () => fetchOrders(userId, role, scope, teamMemberIds),
    enabled: enabled && !!userId,
    staleTime: 60 * 1_000, // 1 phút
    onError: (error: Error) => {
      errorTracker.logError(error, { action: 'useOrdersList.fetch' })
    },
  } as any)
}

/**
 * Hook để update order status với Optimistic Update
 *
 * Optimistic update flow:
 * 1. Ngay lập tức cập nhật cache (UI phản hồi tức thì)
 * 2. Gửi request lên server
 * 3. Nếu thành công → invalidate để refetch fresh data
 * 4. Nếu thất bại → rollback về state cũ
 */
export function useUpdateOrderStatus(userId: string, scope: 'my' | 'team') {
  const queryClient = useQueryClient()
  const queryKey = orderKeys.list(userId, scope)

  return useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: number; newStatus: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
      if (error) throw error
      return { orderId, newStatus }
    },

    // ── Optimistic update ──────────────────────────────────────────────────
    onMutate: async ({ orderId, newStatus }) => {
      // Cancel outgoing refetches để tránh overwrite optimistic update
      await queryClient.cancelQueries({ queryKey })

      // Snapshot state hiện tại để rollback nếu cần
      const previousOrders = queryClient.getQueryData<OrderWithRelations[]>(queryKey)

      // Cập nhật cache ngay lập tức (optimistic)
      queryClient.setQueryData<OrderWithRelations[]>(queryKey, (old) =>
        old?.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ) ?? []
      )

      // Trả về context để dùng trong onError
      return { previousOrders }
    },

    // ── Rollback nếu lỗi ──────────────────────────────────────────────────
    onError: (error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(queryKey, context.previousOrders)
      }
      errorTracker.logError(error as Error, { action: 'useUpdateOrderStatus' })
    },

    // ── Refetch sau khi thành công ─────────────────────────────────────────
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

/**
 * Hook để cancel order với Optimistic Update
 */
export function useCancelOrder(userId: string, scope: 'my' | 'team') {
  const queryClient = useQueryClient()
  const queryKey = orderKeys.list(userId, scope)

  return useMutation({
    mutationFn: async (orderId: number) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
      if (error) throw error
      return orderId
    },

    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey })
      const previousOrders = queryClient.getQueryData<OrderWithRelations[]>(queryKey)

      queryClient.setQueryData<OrderWithRelations[]>(queryKey, (old) =>
        old?.map((order) =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ) ?? []
      )

      return { previousOrders }
    },

    onError: (_error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(queryKey, context.previousOrders)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
