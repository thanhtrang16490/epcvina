import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'

const INDIGO = '#4f46e5'

interface ARBucket {
  label: string
  count: number
  amount: number
  color: string
  bg: string
}

interface RevenueSummary {
  thisMonth: number
  lastMonth: number
  collectionRate: number
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' VNĐ'

const formatCompact = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(amount)

export default function ReportsScreen() {
  const { contentPaddingBottom } = useTabBarHeight()
  const [arBuckets, setArBuckets] = useState<ARBucket[]>([])
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary>({
    thisMonth: 0,
    lastMonth: 0,
    collectionRate: 0,
  })
  const [topDebtors, setTopDebtors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const fetchData = async () => {
    try {
      setLoading(true)

      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

      // ── Revenue: This month ──
      const { data: thisMonthPayments } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', thisMonthStart)
        .lt('payment_date', nextMonthStart)

      const thisMonthRevenue =
        thisMonthPayments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) ?? 0

      // ── Revenue: Last month ──
      const { data: lastMonthPayments } = await supabase
        .from('payments')
        .select('amount')
        .gte('payment_date', lastMonthStart)
        .lt('payment_date', thisMonthStart)

      const lastMonthRevenue =
        lastMonthPayments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) ?? 0

      // ── Collection rate ──
      const { count: totalUnpaidInvoices } = await supabase
        .from('invoices')
        .select('id', { count: 'exact', head: true })
        .neq('payment_status', 'paid')
        .neq('status', 'cancelled')

      const { count: totalInvoices } = await supabase
        .from('invoices')
        .select('id', { count: 'exact', head: true })
        .neq('status', 'cancelled')

      const collectionRate =
        totalInvoices && totalInvoices > 0
          ? Math.round(((totalInvoices - (totalUnpaidInvoices ?? 0)) / totalInvoices) * 100)
          : 0

      setRevenueSummary({
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        collectionRate,
      })

      // ── AR Aging Buckets ──
      const { data: debtsData } = await supabase
        .from('customer_debts')
        .select('remaining_amount, due_date, status')
        .neq('status', 'paid')

      const buckets: ARBucket[] = [
        { label: '0-30 ngày', count: 0, amount: 0, color: '#059669', bg: '#d1fae5' },
        { label: '31-60 ngày', count: 0, amount: 0, color: '#d97706', bg: '#fef3c7' },
        { label: '61-90 ngày', count: 0, amount: 0, color: '#ea580c', bg: '#ffedd5' },
        { label: '>90 ngày', count: 0, amount: 0, color: '#dc2626', bg: '#fee2e2' },
      ]

      if (debtsData) {
        debtsData.forEach((d: any) => {
          const dueDate = d.due_date ? new Date(d.due_date) : null
          if (!dueDate) {
            // No due date → put in 0-30
            buckets[0].count++
            buckets[0].amount += d.remaining_amount || 0
            return
          }
          const daysPastDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
          if (daysPastDue <= 30) {
            buckets[0].count++
            buckets[0].amount += d.remaining_amount || 0
          } else if (daysPastDue <= 60) {
            buckets[1].count++
            buckets[1].amount += d.remaining_amount || 0
          } else if (daysPastDue <= 90) {
            buckets[2].count++
            buckets[2].amount += d.remaining_amount || 0
          } else {
            buckets[3].count++
            buckets[3].amount += d.remaining_amount || 0
          }
        })
      }

      setArBuckets(buckets)

      // ── Top Debtors ──
      const { data: topDebtorsData } = await supabase
        .from('customer_debts')
        .select('remaining_amount, profiles:customer_id ( full_name )')
        .neq('status', 'paid')
        .order('remaining_amount', { ascending: false })
        .limit(5)

      setTopDebtors(
        (topDebtorsData || []).map((d: any) => ({
          name: d.profiles?.full_name ?? 'Không rõ KH',
          amount: d.remaining_amount,
        }))
      )
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!refreshing) fetchData()
    }, [refreshing])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchData().finally(() => setRefreshing(false))
  }

  const totalAR = arBuckets.reduce((sum, b) => sum + b.amount, 0)

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={INDIGO} />
        <Text style={styles.loadingText}>Đang tải báo cáo...</Text>
      </View>
    )
  }

  const revenueChange = revenueSummary.lastMonth > 0
    ? Math.round(((revenueSummary.thisMonth - revenueSummary.lastMonth) / revenueSummary.lastMonth) * 100)
    : 0

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Báo cáo</Text>
              <Text style={styles.headerSubtitle}>Phân tích công nợ và thu tiền</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="pie-chart" size={24} color={INDIGO} />
            </View>
          </View>
        </View>

        <View style={[styles.content, { paddingBottom: contentPaddingBottom }]}>
          {/* Revenue Summary */}
          <Text style={styles.sectionTitle}>Doanh thu</Text>
          <View style={styles.revenueGrid}>
            <View style={styles.revenueCard}>
              <Text style={styles.revenueLabel}>Tháng này</Text>
              <Text style={styles.revenueValue}>{formatCompact(revenueSummary.thisMonth)}</Text>
              {revenueChange !== 0 && (
                <View style={styles.changeRow}>
                  <Ionicons
                    name={revenueChange > 0 ? 'trending-up' : 'trending-down'}
                    size={14}
                    color={revenueChange > 0 ? '#059669' : '#dc2626'}
                  />
                  <Text
                    style={[styles.changeText, { color: revenueChange > 0 ? '#059669' : '#dc2626' }]}
                  >
                    {revenueChange > 0 ? '+' : ''}{revenueChange}%
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.revenueCard}>
              <Text style={styles.revenueLabel}>Tháng trước</Text>
              <Text style={styles.revenueValue}>{formatCompact(revenueSummary.lastMonth)}</Text>
            </View>
          </View>

          {/* Collection Rate */}
          <View style={styles.collectionCard}>
            <View style={styles.collectionHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <Text style={styles.collectionLabel}>Tỷ lệ thu tiền</Text>
            </View>
            <View style={styles.collectionBar}>
              <View style={[styles.collectionFill, { width: `${Math.max(revenueSummary.collectionRate, 1)}%` as any }]} />
            </View>
            <Text style={styles.collectionValue}>{revenueSummary.collectionRate}%</Text>
          </View>

          {/* AR Aging */}
          <Text style={styles.sectionTitle}>Công nợ theo thời hạn</Text>
          <View style={styles.arContainer}>
            {arBuckets.map((bucket) => (
              <View key={bucket.label} style={styles.arRow}>
                <View style={styles.arLeft}>
                  <View style={[styles.arDot, { backgroundColor: bucket.color }]} />
                  <Text style={styles.arLabel}>{bucket.label}</Text>
                </View>
                <View style={styles.arRight}>
                  <Text style={styles.arCount}>{bucket.count} khoản</Text>
                  <Text style={styles.arAmount}>{formatCurrency(bucket.amount)}</Text>
                </View>
              </View>
            ))}
            <View style={[styles.arRow, styles.arTotalRow]}>
              <Text style={styles.arTotalLabel}>Tổng công nợ</Text>
              <Text style={styles.arTotalAmount}>{formatCurrency(totalAR)}</Text>
            </View>
          </View>

          {/* Top Debtors */}
          {topDebtors.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Khách hàng nợ nhiều nhất</Text>
              <View style={styles.debtorContainer}>
                {topDebtors.map((debtor, idx) => (
                  <View key={idx} style={styles.debtorCard}>
                    <View style={styles.debtorLeft}>
                      <View style={styles.debtorRank}>
                        <Text style={styles.debtorRankText}>#{idx + 1}</Text>
                      </View>
                      <Text style={styles.debtorName} numberOfLines={1}>
                        {debtor.name}
                      </Text>
                    </View>
                    <Text style={styles.debtorAmount}>{formatCurrency(debtor.amount)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 20,
  },
  // Revenue
  revenueGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  revenueCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  revenueLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  revenueValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  // Collection rate
  collectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  collectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  collectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  collectionBar: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  collectionFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 5,
    minWidth: 2,
  },
  collectionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 8,
    textAlign: 'center',
  },
  // AR Aging
  arContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  arRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  arLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  arLabel: {
    fontSize: 14,
    color: '#374151',
  },
  arRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  arCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  arAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    minWidth: 120,
    textAlign: 'right',
  },
  arTotalRow: {
    borderBottomWidth: 0,
    paddingTop: 14,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
  },
  arTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  arTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: INDIGO,
  },
  // Top Debtors
  debtorContainer: {
    gap: 8,
  },
  debtorCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  debtorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  debtorRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  debtorRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: INDIGO,
  },
  debtorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  debtorAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
})
