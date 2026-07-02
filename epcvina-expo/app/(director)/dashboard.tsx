import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardStats {
  monthRevenue: number
  monthOrders: number
  totalAR: number
  overdueAR: number
  activeCustomers: number
  activeSalesmen: number
  unpaidInvoices: number
  lowStockProducts: number
}

interface TopSalesperson {
  sale_id: string
  full_name: string
  cap_bac: string | null
  region_name: string | null
  total_revenue: number
  order_count: number
}

interface RecentLargeOrder {
  id: number
  customer_name: string | null
  total_amount: number
  status: string
  created_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = [
  { id: 'this_month', label: 'Tháng này' },
  { id: 'last_month', label: 'Tháng trước' },
  { id: 'last_3_months', label: '3 tháng' },
  { id: 'this_quarter', label: 'Quý này' },
  { id: 'this_year', label: 'Năm nay' },
  { id: 'all', label: 'Tất cả' },
] as const

type PeriodId = typeof PERIOD_OPTIONS[number]['id']

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xử lý', color: '#d97706', bg: '#fef3c7' },
  ordered: { label: 'Đặt hàng', color: '#d97706', bg: '#fef3c7' },
  processing: { label: 'Đang xử lý', color: '#2563eb', bg: '#dbeafe' },
  shipped: { label: 'Đã giao', color: '#4f46e5', bg: '#e0e7ff' },
  paid: { label: 'Đã TT', color: '#059669', bg: '#d1fae5' },
  completed: { label: 'Hoàn thành', color: '#059669', bg: '#d1fae5' },
  cancelled: { label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2' },
}

const CAP_BAC_MAP: Record<string, { label: string; color: string; bg: string }> = {
  junior: { label: 'Junior', color: '#6b7280', bg: '#f3f4f6' },
  senior: { label: 'Senior', color: '#2563eb', bg: '#dbeafe' },
  leader: { label: 'Leader', color: '#7c3aed', bg: '#f3e8ff' },
  manager: { label: 'Manager', color: '#e11d48', bg: '#ffe4e6' },
}

const ROSE = '#f43f5e'
const ROSE_LIGHT = '#fff1f2'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDateRange(period: PeriodId): { start: string; end: string | null } {
  const now = new Date()
  if (period === 'this_month') {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
    }
  }
  if (period === 'last_month') {
    return {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString(),
    }
  }
  if (period === 'last_3_months') {
    return {
      start: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(),
      end: null,
    }
  }
  if (period === 'this_quarter') {
    const q = Math.floor(now.getMonth() / 3)
    return {
      start: new Date(now.getFullYear(), q * 3, 1).toISOString(),
      end: null,
    }
  }
  if (period === 'this_year') {
    return {
      start: new Date(now.getFullYear(), 0, 1).toISOString(),
      end: null,
    }
  }
  // 'all'
  return { start: new Date(2020, 0, 1).toISOString(), end: null }
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' tỷ'
  }
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' tr'
  }
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ icon, iconBg, iconColor, label, value, sublabel }: {
  icon: string; iconBg: string; iconColor: string; label: string; value: string; sublabel?: string
}) {
  return (
    <View style={styles.kpiCard}>
      <View style={[styles.kpiIconContainer, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <Text style={styles.kpiLabel} numberOfLines={1}>{label}</Text>
      <Text style={styles.kpiValue} numberOfLines={1}>{value}</Text>
      {sublabel ? <Text style={styles.kpiSublabel}>{sublabel}</Text> : null}
    </View>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DirectorDashboard() {
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialMount = useRef(true)

  const [stats, setStats] = useState<DashboardStats>({
    monthRevenue: 0, monthOrders: 0, totalAR: 0, overdueAR: 0,
    activeCustomers: 0, activeSalesmen: 0, unpaidInvoices: 0, lowStockProducts: 0,
  })
  const [topSalespeople, setTopSalespeople] = useState<TopSalesperson[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentLargeOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState<PeriodId>('this_month')

  // ── Scroll handler for tab bar visibility ──
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current)

    if (Math.abs(scrollDiff) > 5) {
      if (scrollDiff > 0 && currentScrollY > 50) {
        emitScrollVisibility(false)
      } else if (scrollDiff < 0) {
        emitScrollVisibility(true)
      }
      lastScrollY.current = currentScrollY
    }

    scrollTimeout.current = setTimeout(() => emitScrollVisibility(true), 2000)
  }

  // ── Data fetching ──
  const fetchDashboard = useCallback(async () => {
    try {
      const { start, end } = getDateRange(period)

      const [
        monthOrdersRes,
        monthRevenueRes,
        totalARRes,
        overdueARRes,
        activeCustomersRes,
        activeSalesmenRes,
        unpaidInvoicesRes,
        lowStockRes,
        topSalesRes,
        recentOrdersRes,
      ] = await Promise.all([
        // Count orders this period
        (() => {
          let q = supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', start)
          if (end) q = q.lte('created_at', end)
          return q
        })(),

        // Revenue this period (paid/completed)
        (() => {
          let q = supabase.from('orders').select('total_amount').gte('created_at', start).in('status', ['paid', 'completed'])
          if (end) q = q.lte('created_at', end)
          return q
        })(),

        // Total AR (non-paid debts)
        supabase.from('customer_debts').select('remaining_amount').neq('status', 'paid'),

        // Overdue AR
        supabase.from('customer_debts').select('remaining_amount').eq('status', 'overdue'),

        // Active customers (distinct customer_id this period)
        (() => {
          let q = supabase.from('orders').select('customer_id').gte('created_at', start)
          if (end) q = q.lte('created_at', end)
          return q
        })(),

        // Active salesmen
        supabase.from('profiles').select('id', { count: 'exact', head: true }).in('role', ['sale', 'sale_admin']).eq('is_active', true),

        // Unpaid invoices
        supabase.from('invoices').select('id', { count: 'exact', head: true }).eq('payment_status', 'unpaid'),

        // Low stock products (stock < 20)
        supabase.from('products').select('id', { count: 'exact', head: true }).lt('stock', 20),

        // Top salespeople this period
        (() => {
          let q = supabase
            .from('orders')
            .select(`
              sale_id,
              total_amount,
              profiles:sale_id ( full_name, cap_bac, region_id,
                regions:region_id ( name )
              )
            `)
            .gte('created_at', start)
            .in('status', ['paid', 'completed'])
            .not('sale_id', 'is', null)
          if (end) q = q.lte('created_at', end)
          return q
        })(),

        // Recent large orders this period (top 5 by amount)
        (() => {
          let q = supabase
            .from('orders')
            .select(`
              id,
              total_amount,
              status,
              created_at,
              profiles:customer_id ( full_name )
            `)
            .gte('created_at', start)
            .order('total_amount', { ascending: false })
            .limit(5)
          if (end) q = q.lte('created_at', end)
          return q
        })(),
      ])

      // Compute revenue
      const monthRevenue = monthRevenueRes.data?.reduce(
        (sum, o) => sum + (o.total_amount || 0), 0
      ) ?? 0

      // Compute total AR
      const totalAR = totalARRes.data?.reduce(
        (sum, d) => sum + (d.remaining_amount || 0), 0
      ) ?? 0

      // Compute overdue AR
      const overdueAR = overdueARRes.data?.reduce(
        (sum, d) => sum + (d.remaining_amount || 0), 0
      ) ?? 0

      // Count distinct active customers
      const distinctCustomers = new Set(
        (activeCustomersRes.data ?? []).map((o) => o.customer_id)
      ).size

      // Aggregate top salespeople
      const salesMap = new Map<string, TopSalesperson>()
      for (const order of topSalesRes.data ?? []) {
        if (!order.sale_id) continue
        const profile = order.profiles as {
          full_name?: string; cap_bac?: string; regions?: { name?: string } | null
        } | null
        const existing = salesMap.get(order.sale_id)
        if (existing) {
          existing.total_revenue += order.total_amount || 0
          existing.order_count += 1
        } else {
          salesMap.set(order.sale_id, {
            sale_id: order.sale_id,
            full_name: profile?.full_name ?? 'Không rõ',
            cap_bac: profile?.cap_bac ?? null,
            region_name: profile?.regions?.name ?? null,
            total_revenue: order.total_amount || 0,
            order_count: 1,
          })
        }
      }
      const top10 = Array.from(salesMap.values())
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 10)

      // Recent large orders
      const recent: RecentLargeOrder[] = (recentOrdersRes.data ?? []).map((o) => ({
        id: o.id,
        customer_name: (o.profiles as { full_name?: string } | null)?.full_name ?? null,
        total_amount: o.total_amount,
        status: o.status,
        created_at: o.created_at,
      }))

      setStats({
        monthRevenue,
        monthOrders: monthOrdersRes.count ?? 0,
        totalAR,
        overdueAR,
        activeCustomers: distinctCustomers,
        activeSalesmen: activeSalesmenRes.count ?? 0,
        unpaidInvoices: unpaidInvoicesRes.count ?? 0,
        lowStockProducts: lowStockRes.count ?? 0,
      })
      setTopSalespeople(top10)
      setRecentOrders(recent)
    } catch (err) {
      console.error('[DirectorDashboard] Error fetching data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [period])

  useEffect(() => {
    fetchDashboard()
    isInitialMount.current = false
  }, [fetchDashboard])

  useFocusEffect(
    useCallback(() => {
      if (!isInitialMount.current && !refreshing) {
        fetchDashboard()
      }
    }, [refreshing, fetchDashboard])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchDashboard()
  }

  const periodLabel = PERIOD_OPTIONS.find((o) => o.id === period)?.label ?? period

  // ── Loading ──
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ROSE} />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ROSE]} />}
      >
        <AppHeader />

        {/* Page Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerRow}>
                <Ionicons name="ribbon" size={24} color={ROSE} />
                <Text style={styles.headerTitle}>Giám đốc</Text>
              </View>
              <Text style={styles.headerSubtitle}>Tổng quan kinh doanh — {periodLabel}</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
              disabled={refreshing}
            >
              <Ionicons name="refresh" size={20} color={ROSE} />
            </TouchableOpacity>
          </View>

          {/* Period Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.periodContainer}
            contentContainerStyle={styles.periodContent}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.periodTab, period === opt.id && styles.periodTabActive]}
                onPress={() => setPeriod(opt.id)}
              >
                <Text style={[styles.periodTabText, period === opt.id && styles.periodTabTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* KPI Row 1 — Revenue & Orders */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Kinh doanh — {periodLabel}</Text>
          <View style={styles.kpiGrid}>
            <KpiCard icon="trending-up" iconBg="#ffe4e6" iconColor={ROSE} label="Doanh thu" value={formatCurrency(stats.monthRevenue)} sublabel="Đã TT / hoàn thành" />
            <KpiCard icon="cart" iconBg="#fef3c7" iconColor="#d97706" label="Đơn hàng" value={formatNumber(stats.monthOrders)} sublabel="Tất cả trạng thái" />
            <KpiCard icon="alert-circle" iconBg="#ffedd5" iconColor="#ea580c" label="Công nợ hiện tại" value={formatCurrency(stats.totalAR)} sublabel="Chưa thanh toán" />
            <KpiCard icon="time" iconBg="#fee2e2" iconColor="#dc2626" label="Nợ quá hạn" value={formatCurrency(stats.overdueAR)} sublabel="Cần xử lý ngay" />
          </View>
        </View>

        {/* KPI Row 2 — Operations */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Hoạt động</Text>
          <View style={styles.kpiGrid}>
            <KpiCard icon="people" iconBg="#dbeafe" iconColor="#2563eb" label="KH hoạt động" value={formatNumber(stats.activeCustomers)} sublabel="Có đơn trong kỳ" />
            <KpiCard icon="person" iconBg="#d1fae5" iconColor="#059669" label="NV kinh doanh" value={formatNumber(stats.activeSalesmen)} sublabel="Đang hoạt động" />
            <KpiCard icon="document-text" iconBg="#e0e7ff" iconColor="#4f46e5" label="HĐ chưa TT" value={formatNumber(stats.unpaidInvoices)} sublabel="Cần thu hồi" />
            <KpiCard icon="cube" iconBg="#f3e8ff" iconColor="#7c3aed" label="Hàng sắp hết" value={formatNumber(stats.lowStockProducts)} sublabel="Tồn kho < 20" />
          </View>
        </View>

        {/* Top Salespeople */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top nhân viên KD</Text>
            <Text style={styles.sectionSubtitle}>{periodLabel}</Text>
          </View>

          {topSalespeople.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="person-outline" size={40} color="#d1d5db" />
              <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
            </View>
          ) : (
            <View style={styles.leaderboardList}>
              {topSalespeople.map((person, idx) => {
                const cb = CAP_BAC_MAP[person.cap_bac ?? ''] ?? { label: person.cap_bac ?? '', color: '#6b7280', bg: '#f3f4f6' }
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null
                const rankBg = idx === 0 ? '#fff7ed' : idx === 1 ? '#f8fafc' : idx === 2 ? '#fffbeb' : '#f9fafb'
                return (
                  <View key={person.sale_id} style={[styles.leaderboardCard, { backgroundColor: rankBg }]}>
                    <View style={styles.leaderboardLeft}>
                      <View style={[styles.rankCircle, idx < 3 && styles.rankCircleTop]}>
                        {medal ? (
                          <Text style={styles.medalEmoji}>{medal}</Text>
                        ) : (
                          <Text style={styles.rankNumber}>{idx + 1}</Text>
                        )}
                      </View>
                      <View style={styles.leaderboardInfo}>
                        <View style={styles.leaderboardNameRow}>
                          <Text style={styles.leaderboardName} numberOfLines={1}>{person.full_name}</Text>
                          {person.cap_bac && (
                            <View style={[styles.capBacBadge, { backgroundColor: cb.bg }]}>
                              <Text style={[styles.capBacText, { color: cb.color }]}>{cb.label}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.leaderboardSub} numberOfLines={1}>
                          {person.region_name ?? 'Chưa phân vùng'} · {person.order_count} đơn
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.leaderboardRevenue}>{formatCurrency(person.total_revenue)}</Text>
                  </View>
                )
              })}
            </View>
          )}
        </View>

        {/* Recent Large Orders */}
        <View style={[styles.sectionContainer, { paddingBottom: contentPaddingBottom }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn lớn gần đây</Text>
            <Text style={styles.sectionSubtitle}>Top 5 — {periodLabel}</Text>
          </View>

          {recentOrders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={40} color="#d1d5db" />
              <Text style={styles.emptyText}>Chưa có đơn hàng</Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {recentOrders.map((order) => {
                const st = ORDER_STATUS_MAP[order.status] ?? { label: order.status, color: '#6b7280', bg: '#f3f4f6' }
                const date = new Date(order.created_at).toLocaleDateString('vi-VN')
                return (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderLeft}>
                      <View style={styles.orderIconContainer}>
                        <Ionicons name="receipt" size={18} color={ROSE} />
                      </View>
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderNumber}>Đơn #{order.id}</Text>
                        <Text style={styles.orderCustomer} numberOfLines={1}>
                          {order.customer_name ?? 'Không rõ KH'}
                        </Text>
                        <Text style={styles.orderDate}>{date}</Text>
                      </View>
                    </View>
                    <View style={styles.orderRight}>
                      <Text style={styles.orderAmount}>{formatCurrency(order.total_amount)}</Text>
                      <View style={[styles.orderBadge, { backgroundColor: st.bg }]}>
                        <Text style={[styles.orderBadgeText, { color: st.color }]}>{st.label}</Text>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ROSE_LIGHT },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: ROSE_LIGHT },
  loadingText: { marginTop: 12, color: '#666', fontSize: 14 },
  scrollView: { flex: 1 },

  // Header
  header: { backgroundColor: ROSE_LIGHT, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  headerLeft: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  refreshButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 3 },

  // Period tabs
  periodContainer: { marginTop: 4 },
  periodContent: { gap: 8, paddingRight: 16 },
  periodTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: '#fecdd3' },
  periodTabActive: { backgroundColor: ROSE, borderColor: ROSE },
  periodTabText: { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  periodTabTextActive: { color: 'white' },

  // Sections
  sectionContainer: { paddingHorizontal: 16, paddingTop: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  sectionSubtitle: { fontSize: 12, color: '#9ca3af' },

  // KPI Grid
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: { width: '48%', backgroundColor: 'white', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  kpiIconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  kpiLabel: { fontSize: 11, fontWeight: '500', color: '#6b7280', marginBottom: 2 },
  kpiValue: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  kpiSublabel: { fontSize: 10, color: '#9ca3af', marginTop: 2 },

  // Leaderboard
  leaderboardList: { gap: 8 },
  leaderboardCard: { borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  leaderboardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  rankCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  rankCircleTop: { backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  medalEmoji: { fontSize: 18 },
  rankNumber: { fontSize: 14, fontWeight: 'bold', color: ROSE },
  leaderboardInfo: { flex: 1, minWidth: 0 },
  leaderboardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  leaderboardName: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  leaderboardSub: { fontSize: 11, color: '#9ca3af', marginTop: 1 },
  capBacBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  capBacText: { fontSize: 9, fontWeight: '700' },
  leaderboardRevenue: { fontSize: 14, fontWeight: 'bold', color: '#be123c' },

  // Orders
  ordersList: { gap: 8 },
  orderCard: { backgroundColor: 'white', borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  orderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  orderIconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#ffe4e6', justifyContent: 'center', alignItems: 'center' },
  orderInfo: { flex: 1, minWidth: 0 },
  orderNumber: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  orderCustomer: { fontSize: 11, color: '#6b7280', marginTop: 1 },
  orderDate: { fontSize: 10, color: '#9ca3af', marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 4 },
  orderAmount: { fontSize: 13, fontWeight: 'bold', color: '#be123c' },
  orderBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  orderBadgeText: { fontSize: 10, fontWeight: '600' },

  // Empty
  emptyCard: { backgroundColor: 'white', borderRadius: 14, padding: 32, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 14, color: '#9ca3af' },
})
