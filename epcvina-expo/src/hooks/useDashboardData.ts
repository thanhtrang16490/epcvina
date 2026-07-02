import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { errorTracker } from '../lib/error-tracking'
import type { DashboardStats, TeamStats } from '../types'
import type { RevenueDataPoint } from '../components/dashboard/RevenueChart'

// ─── Query Key Factory ────────────────────────────────────────────────────────

/**
 * Centralized query key factory cho dashboard queries.
 * Dùng để invalidate cache chính xác.
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (filter: string, profileId: string) =>
    ['dashboard', 'stats', filter, profileId] as const,
  recentOrders: (profileId: string) =>
    ['dashboard', 'recentOrders', profileId] as const,
  revenueChart: (filter: string, profileId: string) =>
    ['dashboard', 'revenueChart', filter, profileId] as const,
}

// ─── Utility: Date Range ──────────────────────────────────────────────────────

/**
 * Tính toán date range dựa trên filter string.
 * Pure function, không có side effects.
 */
export function getDateRange(filter: string): { startDate: string; endDate: string } {
  const now = new Date()
  let startDate = new Date()
  let endDate = new Date()

  switch (filter) {
    case 'today':
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      break
    case 'yesterday':
      startDate.setDate(now.getDate() - 1)
      startDate.setHours(0, 0, 0, 0)
      endDate.setDate(now.getDate() - 1)
      endDate.setHours(23, 59, 59, 999)
      break
    case 'last7days':
      startDate.setDate(now.getDate() - 7)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      break
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      break
    case 'lastMonth':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
      break
    case 'thisQuarter': {
      const quarter = Math.floor(now.getMonth() / 3)
      startDate = new Date(now.getFullYear(), quarter * 3, 1)
      endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999)
      break
    }
    case 'thisYear':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
      break
    case 'all':
      startDate = new Date(2000, 0, 1)
      endDate = new Date(now.getFullYear() + 1, 0, 1)
      break
    default:
      startDate.setHours(0, 0, 0, 0)
  }

  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
}

// ─── Query Functions ──────────────────────────────────────────────────────────

/**
 * Fetch dashboard stats từ Supabase.
 * Được dùng làm queryFn cho useQuery.
 */
async function fetchDashboardStats(
  filter: string,
  profile: any
): Promise<DashboardStats> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { startDate, endDate } = getDateRange(filter)

  const isSale = profile?.role === 'sale'
  const isSaleAdmin = profile?.role === 'sale_admin'

  // For Sale Admin, fetch managed sales IDs
  let managedSaleIds: string[] = []
  if (isSaleAdmin) {
    const { data: managedSales } = await supabase
      .from('profiles')
      .select('id')
      .eq('manager_id', user.id)
    managedSaleIds = managedSales?.map((s: any) => s.id) || []
  }

  // 1. Ordered count
  let orderedQuery = supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ordered')
    .gte('created_at', startDate)
    .lt('created_at', endDate)

  if (isSale) {
    orderedQuery = orderedQuery.eq('sale_id', user.id)
  } else if (isSaleAdmin) {
    orderedQuery = orderedQuery.in('sale_id', [user.id, ...managedSaleIds])
  }
  const { count: orderedCount } = await orderedQuery

  // 2. Low stock products
  const { count: lowStockCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .lt('stock', 20)

  // 3. Customer count
  let customerQuery = supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  if (isSale) {
    customerQuery = customerQuery.eq('assigned_to', user.id)
  } else if (isSaleAdmin) {
    customerQuery = customerQuery.in('assigned_to', [user.id, ...managedSaleIds])
  }
  const { count: customerCount } = await customerQuery

  // 4. Total revenue from completed orders
  let revenueQuery = supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lt('created_at', endDate)

  if (isSale) {
    revenueQuery = revenueQuery.eq('sale_id', user.id)
  } else if (isSaleAdmin) {
    revenueQuery = revenueQuery.in('sale_id', [user.id, ...managedSaleIds])
  }
  const { data: completedOrders } = await revenueQuery
  const totalRevenue =
    completedOrders?.reduce((sum, o: any) => sum + (o.total_amount || 0), 0) || 0

  return {
    orderedCount: orderedCount || 0,
    lowStockCount: lowStockCount || 0,
    customerCount: customerCount || 0,
    totalRevenue,
  }
}

/**
 * Fetch revenue chart data - nhóm doanh thu theo ngày/tuần/tháng
 */
async function fetchRevenueChartData(
  filter: string,
  profile: any
): Promise<RevenueDataPoint[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { startDate, endDate } = getDateRange(filter)
  const isSale = profile?.role === 'sale'
  const isSaleAdmin = profile?.role === 'sale_admin'

  let managedSaleIds: string[] = []
  if (isSaleAdmin) {
    const { data: managedSales } = await supabase
      .from('profiles').select('id').eq('manager_id', user.id)
    managedSaleIds = managedSales?.map((s: any) => s.id) || []
  }

  // Fetch completed orders trong khoảng thời gian
  let query = supabase
    .from('orders')
    .select('total_amount, created_at')
    .eq('status', 'completed')
    .gte('created_at', startDate)
    .lt('created_at', endDate)
    .order('created_at', { ascending: true })

  if (isSale) query = query.eq('sale_id', user.id)
  else if (isSaleAdmin) query = query.in('sale_id', [user.id, ...managedSaleIds])

  const { data: orders, error } = await query
  if (error) throw error
  if (!orders || orders.length === 0) return []

  // Xác định cách nhóm dữ liệu dựa trên filter
  const groupByDay = ['today', 'yesterday', 'last7days'].includes(filter)
  const groupByMonth = ['thisYear', 'all'].includes(filter)
  // Còn lại (thisMonth, lastMonth, thisQuarter) → nhóm theo tuần

  const grouped: Record<string, number> = {}

  orders.forEach((order: any) => {
    const date = new Date(order.created_at)
    let key: string

    if (groupByDay) {
      // Nhóm theo giờ (hôm nay) hoặc ngày trong tuần
      if (filter === 'today' || filter === 'yesterday') {
        const hour = date.getHours()
        key = `${hour}h`
      } else {
        // last7days - nhóm theo ngày
        key = `${date.getDate()}/${date.getMonth() + 1}`
      }
    } else if (groupByMonth) {
      // Nhóm theo tháng
      key = `T${date.getMonth() + 1}`
    } else {
      // Nhóm theo tuần trong tháng
      const weekOfMonth = Math.ceil(date.getDate() / 7)
      key = `T${weekOfMonth}`
    }

    grouped[key] = (grouped[key] || 0) + (order.total_amount || 0)
  })

  // Tạo đầy đủ các kỳ (kể cả kỳ không có doanh thu)
  const result: RevenueDataPoint[] = []
  const now = new Date()

  if (filter === 'today' || filter === 'yesterday') {
    // 24 giờ
    for (let h = 0; h < 24; h += 3) {
      const key = `${h}h`
      const isNow = filter === 'today' && now.getHours() >= h && now.getHours() < h + 3
      result.push({ label: key, value: grouped[key] || 0, isHighlight: isNow })
    }
  } else if (filter === 'last7days') {
    // 7 ngày
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const key = `${d.getDate()}/${d.getMonth() + 1}`
      result.push({ label: key, value: grouped[key] || 0, isHighlight: i === 0 })
    }
  } else if (filter === 'thisMonth' || filter === 'lastMonth') {
    // 4-5 tuần
    for (let w = 1; w <= 5; w++) {
      const key = `T${w}`
      if (grouped[key] !== undefined || w <= 4) {
        result.push({ label: key, value: grouped[key] || 0, isHighlight: false })
      }
    }
  } else if (filter === 'thisQuarter') {
    // 3 tháng
    const quarter = Math.floor(now.getMonth() / 3)
    for (let m = quarter * 3; m < quarter * 3 + 3; m++) {
      const key = `T${m + 1}`
      result.push({ label: key, value: grouped[key] || 0, isHighlight: m === now.getMonth() })
    }
  } else {
    // thisYear / all - 12 tháng
    for (let m = 1; m <= 12; m++) {
      const key = `T${m}`
      result.push({ label: key, value: grouped[key] || 0, isHighlight: m === now.getMonth() + 1 })
    }
  }

  return result
}

/**
 * Fetch recent orders từ Supabase.
 * Được dùng làm queryFn cho useQuery.
 */
async function fetchRecentOrdersData(profile: any): Promise<any[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const isSale = profile?.role === 'sale'
  const isSaleAdmin = profile?.role === 'sale_admin'

  let managedSaleIds: string[] = []
  if (isSaleAdmin) {
    const { data: managedSales } = await supabase
      .from('profiles')
      .select('id')
      .eq('manager_id', user.id)
    managedSaleIds = managedSales?.map((s: any) => s.id) || []
  }

  let query = supabase
    .from('orders')
    .select('id, status, total_amount, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  if (isSale) {
    query = query.eq('sale_id', user.id)
  } else if (isSaleAdmin) {
    query = query.in('sale_id', [user.id, ...managedSaleIds])
  }

  const { data, error } = await query
  if (error) throw error

  return data || []
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Custom hook để fetch dashboard data sử dụng React Query.
 *
 * Lợi ích so với useState/useEffect:
 * - Tự động cache theo queryKey (filter + profileId)
 * - Background refetch khi stale
 * - Deduplication: nhiều component dùng cùng key → 1 request
 * - `refetch` function để manual refresh
 *
 * @param activeFilter - Filter thời gian hiện tại
 * @param profile - User profile (cần có id và role)
 * @returns Dashboard data và loading states
 */
export function useDashboardData(activeFilter: string, profile: any) {
  const queryClient = useQueryClient()
  const profileId = profile?.id ?? ''

  // ── Stats query ──────────────────────────────────────────────────────────
  const {
    data: stats = {
      orderedCount: 0,
      lowStockCount: 0,
      customerCount: 0,
      totalRevenue: 0,
    },
    isFetching: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<DashboardStats>({
    queryKey: dashboardKeys.stats(activeFilter, profileId),
    queryFn: () => fetchDashboardStats(activeFilter, profile),
    enabled: !!profile,
    staleTime: 2 * 60 * 1_000, // 2 phút
    onError: (error: Error) => {
      errorTracker.logError(error, { action: 'useDashboardData.fetchStats' })
    },
  } as any)

  // ── Revenue chart query ──────────────────────────────────────────────────
  const {
    data: revenueChartData = [],
    isFetching: chartLoading,
    refetch: refetchChart,
  } = useQuery<RevenueDataPoint[]>({
    queryKey: dashboardKeys.revenueChart(activeFilter, profileId),
    queryFn: () => fetchRevenueChartData(activeFilter, profile),
    enabled: !!profile,
    staleTime: 3 * 60 * 1_000,
    onError: (error: Error) => {
      errorTracker.logError(error, { action: 'useDashboardData.fetchRevenueChart' })
    },
  } as any)

  // ── Recent orders query ──────────────────────────────────────────────────
  const {
    data: recentOrders = [],
    isFetching: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery<any[]>({
    queryKey: dashboardKeys.recentOrders(profileId),
    queryFn: () => fetchRecentOrdersData(profile),
    enabled: !!profile,
    staleTime: 1 * 60 * 1_000, // 1 phút (orders thay đổi thường xuyên hơn)
    onError: (error: Error) => {
      errorTracker.logError(error, { action: 'useDashboardData.fetchRecentOrders' })
    },
  } as any)

  // ── Combined refetch ─────────────────────────────────────────────────────
  const [isRefetching, setIsRefetching] = useState(false)

  const refetch = async () => {
    setIsRefetching(true)
    try {
      await Promise.all([refetchStats(), refetchOrders(), refetchChart()])
    } finally {
      setIsRefetching(false)
    }
  }

  // ── Placeholder team stats (for backward compat) ─────────────────────────
  const teamStats: TeamStats = {
    teamMembers: 0,
    teamCustomers: 0,
    teamOrders: 0,
    teamRevenue: 0,
  }

  return {
    stats,
    teamStats,
    recentOrders,
    revenueChartData,
    topPerformers: [] as any[],
    loading: statsLoading || ordersLoading || isRefetching,
    error: statsError || ordersError,
    refetch,
  }
}
