import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'

const ROSE = '#f43f5e'
const ROSE_LIGHT = '#fff1f2'

// ─── Types ───────────────────────────────────────────────────────────────────

interface MonthlyRevenue {
  month: string
  revenue: number
  order_count: number
}

interface SalesTeamPerformance {
  region_name: string
  total_revenue: number
  order_count: number
  salesperson_count: number
}

interface FulfillmentMetrics {
  total_orders: number
  completed_orders: number
  completion_rate: number
}

interface ARBucket {
  label: string
  amount: number
  count: number
  color: string
  bg: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' tỷ'
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' tr'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReportCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <View style={styles.reportCard}>
      <View style={styles.reportCardHeader}>
        <View style={styles.reportCardHeaderLeft}>
          <View style={styles.reportCardIcon}>
            <Ionicons name={icon as any} size={16} color={ROSE} />
          </View>
          <Text style={styles.reportCardTitle}>{title}</Text>
        </View>
      </View>
      {children}
    </View>
  )
}

function BarItem({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0
  return (
    <View style={styles.barItem}>
      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{formatCurrency(value)}</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DirectorReports() {
  const { contentPaddingBottom } = useTabBarHeight()
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialMount = useRef(true)

  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([])
  const [teamPerformance, setTeamPerformance] = useState<SalesTeamPerformance[]>([])
  const [fulfillment, setFulfillment] = useState<FulfillmentMetrics>({ total_orders: 0, completed_orders: 0, completion_rate: 0 })
  const [arBuckets, setArBuckets] = useState<ARBucket[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    if (Math.abs(scrollDiff) > 5) {
      if (scrollDiff > 0 && currentScrollY > 50) emitScrollVisibility(false)
      else if (scrollDiff < 0) emitScrollVisibility(true)
      lastScrollY.current = currentScrollY
    }
    scrollTimeout.current = setTimeout(() => emitScrollVisibility(true), 2000)
  }

  const fetchReports = useCallback(async () => {
    try {
      const now = new Date()
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()

      // Monthly revenue (last 6 months)
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .in('status', ['paid', 'completed'])
        .gte('created_at', sixMonthsAgo)

      const grouped: Record<string, { revenue: number; count: number }> = {}
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `T${d.getMonth() + 1}/${d.getFullYear().toString().slice(2)}`
        grouped[key] = { revenue: 0, count: 0 }
      }

      ;(revenueData ?? []).forEach((o) => {
        const d = new Date(o.created_at)
        const key = `T${d.getMonth() + 1}/${d.getFullYear().toString().slice(2)}`
        if (grouped[key]) {
          grouped[key].revenue += o.total_amount || 0
          grouped[key].count += 1
        }
      })

      const monthly: MonthlyRevenue[] = Object.entries(grouped).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        order_count: data.count,
      }))
      setMonthlyRevenue(monthly)

      // Team performance by region
      const { data: salesOrders } = await supabase
        .from('orders')
        .select('total_amount, sale_id, profiles:sale_id ( region_id, regions:region_id ( name ) )')
        .in('status', ['paid', 'completed'])
        .gte('created_at', sixMonthsAgo)
        .not('sale_id', 'is', null)

      const regionMap: Record<string, { revenue: number; count: number; salesIds: Set<string> }> = {}
      ;(salesOrders ?? []).forEach((o) => {
        const profile = o.profiles as { regions?: { name?: string } | null } | null
        const regionName = profile?.regions?.name ?? 'Chưa phân vùng'
        if (!regionMap[regionName]) {
          regionMap[regionName] = { revenue: 0, count: 0, salesIds: new Set() }
        }
        regionMap[regionName].revenue += o.total_amount || 0
        regionMap[regionName].count += 1
        if (o.sale_id) regionMap[regionName].salesIds.add(o.sale_id)
      })

      const teams: SalesTeamPerformance[] = Object.entries(regionMap)
        .map(([region_name, data]) => ({
          region_name,
          total_revenue: data.revenue,
          order_count: data.count,
          salesperson_count: data.salesIds.size,
        }))
        .sort((a, b) => b.total_revenue - a.total_revenue)
      setTeamPerformance(teams)

      // Fulfillment metrics
      const [totalRes, completedRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).in('status', ['completed', 'paid']),
      ])
      const total = totalRes.count ?? 0
      const completed = completedRes.count ?? 0
      setFulfillment({
        total_orders: total,
        completed_orders: completed,
        completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      })

      // AR aging
      const { data: debtData } = await supabase
        .from('customer_debts')
        .select('remaining_amount, due_date, status')
        .neq('status', 'paid')

      const buckets = { '0-30': { amount: 0, count: 0 }, '31-60': { amount: 0, count: 0 }, '61-90': { amount: 0, count: 0 }, '90+': { amount: 0, count: 0 } }
      const today = new Date()
      ;(debtData ?? []).forEach((d) => {
        const amount = d.remaining_amount || 0
        if (d.status === 'overdue' && d.due_date) {
          const dueDate = new Date(d.due_date)
          const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays <= 30) { buckets['0-30'].amount += amount; buckets['0-30'].count += 1 }
          else if (diffDays <= 60) { buckets['31-60'].amount += amount; buckets['31-60'].count += 1 }
          else if (diffDays <= 90) { buckets['61-90'].amount += amount; buckets['61-90'].count += 1 }
          else { buckets['90+'].amount += amount; buckets['90+'].count += 1 }
        } else {
          buckets['0-30'].amount += amount; buckets['0-30'].count += 1
        }
      })

      const arColors = [
        { color: '#059669', bg: '#d1fae5' },
        { color: '#d97706', bg: '#fef3c7' },
        { color: '#ea580c', bg: '#ffedd5' },
        { color: '#dc2626', bg: '#fee2e2' },
      ]
      const arResult: ARBucket[] = Object.entries(buckets).map(([label, data], i) => ({
        label: `${label} ngày`,
        amount: data.amount,
        count: data.count,
        ...arColors[i],
      }))
      setArBuckets(arResult)
    } catch (err) {
      console.error('[DirectorReports] Error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
    isInitialMount.current = false
  }, [fetchReports])

  useFocusEffect(
    useCallback(() => {
      if (!isInitialMount.current && !refreshing) fetchReports()
    }, [refreshing, fetchReports])
  )

  const onRefresh = () => { setRefreshing(true); fetchReports() }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ROSE} />
        <Text style={styles.loadingText}>Đang tải báo cáo...</Text>
      </View>
    )
  }

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1)
  const maxTeamRevenue = Math.max(...teamPerformance.map(t => t.total_revenue), 1)
  const maxArBucket = Math.max(...arBuckets.map(b => b.amount), 1)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ROSE]} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Báo cáo</Text>
          <Text style={styles.headerSubtitle}>Tổng hợp số liệu kinh doanh</Text>
        </View>

        {/* Revenue Trend */}
        <View style={styles.sectionContainer}>
          <ReportCard title="Doanh thu theo tháng" icon="bar-chart">
            {monthlyRevenue.map((m) => (
              <BarItem key={m.month} label={m.month} value={m.revenue} maxValue={maxRevenue} color={ROSE} />
            ))}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng 6 tháng</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(monthlyRevenue.reduce((s, m) => s + m.revenue, 0))}
              </Text>
            </View>
          </ReportCard>
        </View>

        {/* Team Performance */}
        <View style={styles.sectionContainer}>
          <ReportCard title="Hiệu suất theo vùng" icon="people">
            {teamPerformance.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
            ) : (
              teamPerformance.map((t) => (
                <BarItem key={t.region_name} label={t.region_name} value={t.total_revenue} maxValue={maxTeamRevenue} color="#7c3aed" />
              ))
            )}
            {teamPerformance.length > 0 && (
              <View style={styles.teamSummary}>
                {teamPerformance.map((t) => (
                  <View key={t.region_name} style={styles.teamSummaryItem}>
                    <Text style={styles.teamSummaryName}>{t.region_name}</Text>
                    <Text style={styles.teamSummaryDetail}>{t.salesperson_count} NV · {t.order_count} đơn</Text>
                  </View>
                ))}
              </View>
            )}
          </ReportCard>
        </View>

        {/* Fulfillment */}
        <View style={styles.sectionContainer}>
          <ReportCard title="Tỷ lệ hoàn thành đơn hàng" icon="checkmark-circle">
            <View style={styles.fulfillmentContainer}>
              <View style={styles.fulfillmentCircle}>
                <Text style={styles.fulfillmentPercent}>{fulfillment.completion_rate}%</Text>
              </View>
              <View style={styles.fulfillmentDetails}>
                <View style={styles.fulfillmentRow}>
                  <Text style={styles.fulfillmentLabel}>Tổng đơn hàng</Text>
                  <Text style={styles.fulfillmentValue}>{formatNumber(fulfillment.total_orders)}</Text>
                </View>
                <View style={styles.fulfillmentRow}>
                  <Text style={styles.fulfillmentLabel}>Đã hoàn thành</Text>
                  <Text style={[styles.fulfillmentValue, { color: '#059669' }]}>{formatNumber(fulfillment.completed_orders)}</Text>
                </View>
                <View style={styles.fulfillmentRow}>
                  <Text style={styles.fulfillmentLabel}>Chưa hoàn thành</Text>
                  <Text style={[styles.fulfillmentValue, { color: '#d97706' }]}>{formatNumber(fulfillment.total_orders - fulfillment.completed_orders)}</Text>
                </View>
              </View>
            </View>
          </ReportCard>
        </View>

        {/* AR Aging */}
        <View style={[styles.sectionContainer, { paddingBottom: contentPaddingBottom }]}>
          <ReportCard title="Công nợ theo thời hạn" icon="time">
            {arBuckets.map((b) => (
              <BarItem key={b.label} label={b.label} value={b.amount} maxValue={maxArBucket} color={b.color} />
            ))}
            <View style={styles.arTotalRow}>
              <Text style={styles.arTotalLabel}>Tổng công nợ</Text>
              <Text style={styles.arTotalValue}>
                {formatCurrency(arBuckets.reduce((s, b) => s + b.amount, 0))}
              </Text>
            </View>
          </ReportCard>
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

  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },

  sectionContainer: { paddingHorizontal: 16, paddingTop: 12 },

  // Report card
  reportCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  reportCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  reportCardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reportCardIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#ffe4e6', justifyContent: 'center', alignItems: 'center' },
  reportCardTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },

  // Bar chart items
  barItem: { marginBottom: 10 },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  barLabel: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  barValue: { fontSize: 12, color: '#111827', fontWeight: '600' },
  barTrack: { height: 6, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },

  // Summary
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  summaryLabel: { fontSize: 13, color: '#6b7280' },
  summaryValue: { fontSize: 14, fontWeight: 'bold', color: ROSE },

  // Team summary
  teamSummary: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  teamSummaryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  teamSummaryName: { fontSize: 12, color: '#374151', fontWeight: '500' },
  teamSummaryDetail: { fontSize: 11, color: '#9ca3af' },

  // Fulfillment
  fulfillmentContainer: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  fulfillmentCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center' },
  fulfillmentPercent: { fontSize: 22, fontWeight: 'bold', color: '#059669' },
  fulfillmentDetails: { flex: 1, gap: 6 },
  fulfillmentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fulfillmentLabel: { fontSize: 13, color: '#6b7280' },
  fulfillmentValue: { fontSize: 14, fontWeight: '600', color: '#111827' },

  // AR total
  arTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  arTotalLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },
  arTotalValue: { fontSize: 14, fontWeight: 'bold', color: '#dc2626' },

  emptyText: { fontSize: 14, color: '#9ca3af', textAlign: 'center', paddingVertical: 16 },
})
