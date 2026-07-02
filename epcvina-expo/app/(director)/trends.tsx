import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'

const ROSE = '#f43f5e'
const ROSE_LIGHT = '#fff1f2'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TrendMetric {
  label: string
  currentValue: number
  previousValue: number
  growthPercent: number
  icon: string
  color: string
  bg: string
  format: 'currency' | 'number'
}

interface PeriodData {
  revenue: number
  orderCount: number
  customerCount: number
  avgOrderValue: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPARE_OPTIONS = [
  { id: 'month', label: 'Tháng này vs Tháng trước' },
  { id: 'quarter', label: 'Quý này vs Quý trước' },
  { id: 'year', label: 'Năm nay vs Năm trước' },
] as const

type CompareId = typeof COMPARE_OPTIONS[number]['id']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' tỷ'
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' tr'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n)
}

function getPeriodRanges(compare: CompareId): { currentStart: Date; currentEnd: Date; prevStart: Date; prevEnd: Date } {
  const now = new Date()
  if (compare === 'month') {
    return {
      currentStart: new Date(now.getFullYear(), now.getMonth(), 1),
      currentEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      prevStart: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      prevEnd: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
    }
  }
  if (compare === 'quarter') {
    const q = Math.floor(now.getMonth() / 3)
    return {
      currentStart: new Date(now.getFullYear(), q * 3, 1),
      currentEnd: new Date(now.getFullYear(), q * 3 + 3, 0, 23, 59, 59),
      prevStart: new Date(now.getFullYear(), (q - 1) * 3, 1),
      prevEnd: new Date(now.getFullYear(), q * 3, 0, 23, 59, 59),
    }
  }
  // year
  return {
    currentStart: new Date(now.getFullYear(), 0, 1),
    currentEnd: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
    prevStart: new Date(now.getFullYear() - 1, 0, 1),
    prevEnd: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59),
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GrowthIndicator({ value }: { value: number }) {
  if (value === 0) return <Text style={styles.noGrowth}>—</Text>
  const isPositive = value > 0
  return (
    <View style={[styles.growthBadge, { backgroundColor: isPositive ? '#d1fae5' : '#fee2e2' }]}>
      <Ionicons name={isPositive ? 'arrow-up' : 'arrow-down'} size={12} color={isPositive ? '#059669' : '#dc2626'} />
      <Text style={[styles.growthText, { color: isPositive ? '#059669' : '#dc2626' }]}>
        {Math.abs(value).toFixed(1)}%
      </Text>
    </View>
  )
}

function ComparisonCard({ label, currentLabel, currentValue, previousLabel, previousValue, growth, icon, color, bg, format }: {
  label: string; currentLabel: string; currentValue: number; previousLabel: string; previousValue: number
  growth: number; icon: string; color: string; bg: string; format: 'currency' | 'number'
}) {
  const display = format === 'currency' ? formatCurrency : (n: number) => formatNumber(n)
  return (
    <View style={styles.comparisonCard}>
      <View style={styles.comparisonHeader}>
        <View style={[styles.comparisonIcon, { backgroundColor: bg }]}>
          <Ionicons name={icon as any} size={18} color={color} />
        </View>
        <Text style={styles.comparisonLabel}>{label}</Text>
      </View>
      <View style={styles.comparisonValues}>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonRowLabel}>{currentLabel}</Text>
          <Text style={styles.comparisonRowValue}>{display(currentValue)}</Text>
        </View>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonRowLabel}>{previousLabel}</Text>
          <Text style={[styles.comparisonRowValue, { color: '#9ca3af' }]}>{display(previousValue)}</Text>
        </View>
      </View>
      <View style={styles.comparisonFooter}>
        <Text style={styles.comparisonGrowthLabel}>Thay đổi</Text>
        <GrowthIndicator value={growth} />
      </View>
    </View>
  )
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DirectorTrends() {
  const { contentPaddingBottom } = useTabBarHeight()
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialMount = useRef(true)

  const [compare, setCompare] = useState<CompareId>('month')
  const [currentPeriod, setCurrentPeriod] = useState<PeriodData>({ revenue: 0, orderCount: 0, customerCount: 0, avgOrderValue: 0 })
  const [previousPeriod, setPreviousPeriod] = useState<PeriodData>({ revenue: 0, orderCount: 0, customerCount: 0, avgOrderValue: 0 })
  const [newCustomers, setNewCustomers] = useState(0)
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

  const fetchTrends = useCallback(async () => {
    try {
      const { currentStart, currentEnd, prevStart, prevEnd } = getPeriodRanges(compare)

      const [currentOrdersRes, prevOrdersRes, currentCustomersRes, prevCustomersRes] = await Promise.all([
        // Current period orders
        supabase.from('orders')
          .select('total_amount, customer_id')
          .in('status', ['paid', 'completed'])
          .gte('created_at', currentStart.toISOString())
          .lte('created_at', currentEnd.toISOString()),
        // Previous period orders
        supabase.from('orders')
          .select('total_amount, customer_id')
          .in('status', ['paid', 'completed'])
          .gte('created_at', prevStart.toISOString())
          .lte('created_at', prevEnd.toISOString()),
        // Current period distinct customers
        supabase.from('orders')
          .select('customer_id')
          .gte('created_at', currentStart.toISOString())
          .lte('created_at', currentEnd.toISOString()),
        // Previous period distinct customers
        supabase.from('orders')
          .select('customer_id')
          .gte('created_at', prevStart.toISOString())
          .lte('created_at', prevEnd.toISOString()),
      ])

      // Current period metrics
      const curRevenue = currentOrdersRes.data?.reduce((s, o) => s + (o.total_amount || 0), 0) ?? 0
      const curOrders = currentOrdersRes.data?.length ?? 0
      const curCustomerSet = new Set((currentOrdersRes.data ?? []).map(o => o.customer_id).filter(Boolean))
      const curAvgOrder = curOrders > 0 ? curRevenue / curOrders : 0

      setCurrentPeriod({
        revenue: curRevenue,
        orderCount: curOrders,
        customerCount: curCustomerSet.size,
        avgOrderValue: curAvgOrder,
      })

      // Previous period metrics
      const prevRevenue = prevOrdersRes.data?.reduce((s, o) => s + (o.total_amount || 0), 0) ?? 0
      const prevOrders = prevOrdersRes.data?.length ?? 0
      const prevCustomerSet = new Set((currentOrdersRes.data ?? []).map(o => o.customer_id).filter(Boolean))
      const prevAvgOrder = prevOrders > 0 ? prevRevenue / prevOrders : 0

      setPreviousPeriod({
        revenue: prevRevenue,
        orderCount: prevOrders,
        customerCount: prevCustomerSet.size,
        avgOrderValue: prevAvgOrder,
      })

      // New customers (in current period but not in previous)
      const prevCustSet = new Set((prevCustomersRes.data ?? []).map(o => o.customer_id).filter(Boolean))
      const curCustSet = new Set((currentCustomersRes.data ?? []).map(o => o.customer_id).filter(Boolean))
      let newCustCount = 0
      curCustSet.forEach(id => { if (!prevCustSet.has(id)) newCustCount++ })
      setNewCustomers(newCustCount)

    } catch (err) {
      console.error('[DirectorTrends] Error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [compare])

  useEffect(() => {
    fetchTrends()
    isInitialMount.current = false
  }, [fetchTrends])

  useFocusEffect(
    useCallback(() => {
      if (!isInitialMount.current && !refreshing) fetchTrends()
    }, [refreshing, fetchTrends])
  )

  const onRefresh = () => { setRefreshing(true); fetchTrends() }

  const calcGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const getLabels = () => {
    if (compare === 'month') return { current: 'Tháng này', previous: 'Tháng trước' }
    if (compare === 'quarter') return { current: 'Quý này', previous: 'Quý trước' }
    return { current: 'Năm nay', previous: 'Năm trước' }
  }

  const labels = getLabels()

  const metrics: TrendMetric[] = [
    { label: 'Doanh thu', currentValue: currentPeriod.revenue, previousValue: previousPeriod.revenue, growthPercent: calcGrowth(currentPeriod.revenue, previousPeriod.revenue), icon: 'trending-up', color: ROSE, bg: '#ffe4e6', format: 'currency' },
    { label: 'Số đơn hàng', currentValue: currentPeriod.orderCount, previousValue: previousPeriod.orderCount, growthPercent: calcGrowth(currentPeriod.orderCount, previousPeriod.orderCount), icon: 'cart', color: '#d97706', bg: '#fef3c7', format: 'number' },
    { label: 'Giá trị TB/đơn', currentValue: currentPeriod.avgOrderValue, previousValue: previousPeriod.avgOrderValue, growthPercent: calcGrowth(currentPeriod.avgOrderValue, previousPeriod.avgOrderValue), icon: 'pricetag', color: '#7c3aed', bg: '#f3e8ff', format: 'currency' },
    { label: 'Khách hàng hoạt động', currentValue: currentPeriod.customerCount, previousValue: previousPeriod.customerCount, growthPercent: calcGrowth(currentPeriod.customerCount, previousPeriod.customerCount), icon: 'people', color: '#2563eb', bg: '#dbeafe', format: 'number' },
  ]

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ROSE} />
        <Text style={styles.loadingText}>Đang tải xu hướng...</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Xu hướng</Text>
          <Text style={styles.headerSubtitle}>So sánh hiệu suất theo thời gian</Text>
        </View>

        {/* Compare Selector */}
        <View style={styles.compareContainer}>
          {COMPARE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.compareTab, compare === opt.id && styles.compareTabActive]}
              onPress={() => setCompare(opt.id)}
            >
              <Text style={[styles.compareTabText, compare === opt.id && styles.compareTabTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Growth Cards */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Tổng quan tăng trưởng</Text>
          <View style={styles.overviewRow}>
            {metrics.slice(0, 2).map((m) => (
              <View key={m.label} style={styles.overviewCard}>
                <View style={styles.overviewCardHeader}>
                  <View style={[styles.overviewIcon, { backgroundColor: m.bg }]}>
                    <Ionicons name={m.icon as any} size={16} color={m.color} />
                  </View>
                  <GrowthIndicator value={m.growthPercent} />
                </View>
                <Text style={styles.overviewLabel}>{m.label}</Text>
                <Text style={styles.overviewValue}>
                  {m.format === 'currency' ? formatCurrency(m.currentValue) : formatNumber(m.currentValue)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.overviewRow}>
            {metrics.slice(2).map((m) => (
              <View key={m.label} style={styles.overviewCard}>
                <View style={styles.overviewCardHeader}>
                  <View style={[styles.overviewIcon, { backgroundColor: m.bg }]}>
                    <Ionicons name={m.icon as any} size={16} color={m.color} />
                  </View>
                  <GrowthIndicator value={m.growthPercent} />
                </View>
                <Text style={styles.overviewLabel}>{m.label}</Text>
                <Text style={styles.overviewValue}>
                  {m.format === 'currency' ? formatCurrency(m.currentValue) : formatNumber(m.currentValue)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detailed Comparison Cards */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>So sánh chi tiết</Text>
          {metrics.map((m) => (
            <ComparisonCard
              key={m.label}
              label={m.label}
              currentLabel={labels.current}
              currentValue={m.currentValue}
              previousLabel={labels.previous}
              previousValue={m.previousValue}
              growth={m.growthPercent}
              icon={m.icon}
              color={m.color}
              bg={m.bg}
              format={m.format}
            />
          ))}
        </View>

        {/* Customer Acquisition */}
        <View style={[styles.sectionContainer, { paddingBottom: contentPaddingBottom }]}>
          <View style={styles.acquisitionCard}>
            <View style={styles.acquisitionHeader}>
              <Ionicons name="person-add" size={20} color="#059669" />
              <Text style={styles.acquisitionTitle}>Khách hàng mới</Text>
            </View>
            <Text style={styles.acquisitionValue}>{formatNumber(newCustomers)}</Text>
            <Text style={styles.acquisitionSub}>Khách hàng mới trong {labels.current.toLowerCase()}</Text>
            <View style={styles.acquisitionRate}>
              <Text style={styles.acquisitionRateLabel}>Tỷ lệ thu hút</Text>
              <Text style={styles.acquisitionRateValue}>
                {currentPeriod.customerCount > 0
                  ? ((newCustomers / currentPeriod.customerCount) * 100).toFixed(1)
                  : '0.0'}%
              </Text>
            </View>
          </View>
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

  // Compare selector
  compareContainer: { paddingHorizontal: 16, paddingBottom: 8, gap: 6 },
  compareTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: 'white', borderWidth: 1, borderColor: '#fecdd3' },
  compareTabActive: { backgroundColor: ROSE, borderColor: ROSE },
  compareTabText: { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  compareTabTextActive: { color: 'white' },

  // Sections
  sectionContainer: { paddingHorizontal: 16, paddingTop: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },

  // Overview growth cards
  overviewRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  overviewCard: { flex: 1, backgroundColor: 'white', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  overviewCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  overviewIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  overviewLabel: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  overviewValue: { fontSize: 17, fontWeight: 'bold', color: '#111827', marginTop: 2 },

  // Growth badge
  growthBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  growthText: { fontSize: 11, fontWeight: '700' },
  noGrowth: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },

  // Comparison cards
  comparisonCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  comparisonHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  comparisonIcon: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  comparisonLabel: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  comparisonValues: { gap: 6 },
  comparisonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  comparisonRowLabel: { fontSize: 13, color: '#6b7280' },
  comparisonRowValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  comparisonFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  comparisonGrowthLabel: { fontSize: 12, color: '#9ca3af' },

  // Customer acquisition
  acquisitionCard: { backgroundColor: '#d1fae5', borderRadius: 14, padding: 16 },
  acquisitionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  acquisitionTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  acquisitionValue: { fontSize: 28, fontWeight: 'bold', color: '#059669' },
  acquisitionSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  acquisitionRate: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(5, 150, 105, 0.2)' },
  acquisitionRateLabel: { fontSize: 12, color: '#6b7280' },
  acquisitionRateValue: { fontSize: 14, fontWeight: 'bold', color: '#059669' },
})
