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
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'

const INDIGO = '#4f46e5'

interface DashboardStats {
  pendingInvoiceOrders: number
  unpaidInvoices: number
  overdueDebts: number
  totalAR: number
}

interface RecentInvoice {
  id: string
  invoice_number: string
  customer_name: string | null
  total_amount: number
  payment_status: string
  invoice_date: string
  status: string
}

const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  unpaid: { label: 'Chưa TT', color: '#dc2626', bg: '#fee2e2' },
  partial: { label: 'Một phần', color: '#d97706', bg: '#fef3c7' },
  paid: { label: 'Đã TT', color: '#059669', bg: '#d1fae5' },
  overdue: { label: 'Quá hạn', color: '#e11d48', bg: '#ffe4e6' },
}

const INVOICE_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Nháp', color: '#374151', bg: '#f3f4f6' },
  issued: { label: 'Đã phát hành', color: '#2563eb', bg: '#dbeafe' },
  sent: { label: 'Đã gửi', color: '#4f46e5', bg: '#e0e7ff' },
  cancelled: { label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2' },
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' VNĐ'

export default function AccountantDashboard() {
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const [stats, setStats] = useState<DashboardStats>({
    pendingInvoiceOrders: 0,
    unpaidInvoices: 0,
    overdueDebts: 0,
    totalAR: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

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

    scrollTimeout.current = setTimeout(() => {
      emitScrollVisibility(true)
    }, 2000)
  }

  const fetchData = async () => {
    try {
      setLoading(true)

      // Orders needing invoicing: completed/paid but no invoice_id
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .in('status', ['paid', 'completed'])
        .is('invoice_id', null)

      // Unpaid invoices
      const { count: unpaidCount } = await supabase
        .from('invoices')
        .select('id', { count: 'exact', head: true })
        .eq('payment_status', 'unpaid')

      // Overdue debts
      const { count: overdueCount } = await supabase
        .from('customer_debts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'overdue')

      // Total AR (sum of remaining_amount where not paid)
      const { data: arData } = await supabase
        .from('customer_debts')
        .select('remaining_amount')
        .neq('status', 'paid')

      const totalAR = arData?.reduce((sum: number, d: any) => sum + (d.remaining_amount || 0), 0) ?? 0

      setStats({
        pendingInvoiceOrders: pendingCount ?? 0,
        unpaidInvoices: unpaidCount ?? 0,
        overdueDebts: overdueCount ?? 0,
        totalAR,
      })

      // Recent invoices (last 10)
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          total_amount,
          payment_status,
          invoice_date,
          status,
          profiles:customer_id ( full_name )
        `)
        .order('invoice_date', { ascending: false })
        .limit(10)

      if (invoicesData) {
        setRecentInvoices(
          invoicesData.map((inv: any) => ({
            id: inv.id,
            invoice_number: inv.invoice_number,
            total_amount: inv.total_amount,
            payment_status: inv.payment_status,
            invoice_date: inv.invoice_date,
            status: inv.status,
            customer_name: inv.profiles?.full_name ?? null,
          }))
        )
      }
    } catch (error) {
      console.error('Error fetching accountant dashboard:', error)
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={INDIGO} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <AppHeader menuHref="/(sales)/menu" />

        {/* Page Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Kế toán</Text>
              <Text style={styles.headerSubtitle}>Quản lý hóa đơn và công nợ khách hàng</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="trending-up" size={24} color={INDIGO} />
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <StatCard
              title="Chờ lập HĐ"
              icon="clipboard"
              value={stats.pendingInvoiceOrders.toString()}
              color="#d97706"
              bg="#fef3c7"
              onPress={() => router.push('/(accountant)/orders')}
            />
            <StatCard
              title="HĐ chưa TT"
              icon="document-text"
              value={stats.unpaidInvoices.toString()}
              color="#2563eb"
              bg="#dbeafe"
              onPress={() => router.push('/(accountant)/invoices')}
            />
            <StatCard
              title="Nợ quá hạn"
              icon="alert-circle"
              value={stats.overdueDebts.toString()}
              color="#e11d48"
              bg="#ffe4e6"
              onPress={() => router.push('/(accountant)/invoices')}
            />
            <StatCard
              title="Tổng công nợ"
              icon="cash"
              value={formatCurrency(stats.totalAR)}
              color={INDIGO}
              bg="#e0e7ff"
              onPress={() => router.push('/(accountant)/reports')}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
            <View style={styles.actionsGrid}>
              <QuickActionButton
                title="Lập hóa đơn"
                icon="document-text"
                color="#e0e7ff"
                iconColor={INDIGO}
                onPress={() => router.push('/(accountant)/orders')}
              />
              <QuickActionButton
                title="Ghi thu tiền"
                icon="cash"
                color="#d1fae5"
                iconColor="#059669"
                onPress={() => router.push('/(accountant)/payments')}
              />
              <QuickActionButton
                title="Hóa đơn"
                icon="receipt"
                color="#dbeafe"
                iconColor="#2563eb"
                onPress={() => router.push('/(accountant)/invoices')}
              />
              <QuickActionButton
                title="Báo cáo"
                icon="pie-chart"
                color="#fef3c7"
                iconColor="#d97706"
                onPress={() => router.push('/(accountant)/reports')}
              />
            </View>
          </View>

          {/* Recent Invoices */}
          <View style={[styles.recentContainer, { paddingBottom: contentPaddingBottom }]}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Hóa đơn gần đây</Text>
              <TouchableOpacity onPress={() => router.push('/(accountant)/invoices')}>
                <Text style={styles.viewAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            {recentInvoices.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>Chưa có hóa đơn nào</Text>
              </View>
            ) : (
              <View style={styles.invoiceList}>
                {recentInvoices.map((inv) => {
                  const ps = PAYMENT_STATUS_MAP[inv.payment_status] ?? {
                    label: inv.payment_status,
                    color: '#6b7280',
                    bg: '#f3f4f6',
                  }
                  const st = INVOICE_STATUS_MAP[inv.status] ?? {
                    label: inv.status,
                    color: '#6b7280',
                    bg: '#f3f4f6',
                  }
                  return (
                    <View key={inv.id} style={styles.invoiceCard}>
                      <View style={styles.invoiceLeft}>
                        <View style={[styles.invoiceIconContainer, { backgroundColor: '#e0e7ff' }]}>
                          <Ionicons name="document-text" size={20} color={INDIGO} />
                        </View>
                        <View style={styles.invoiceInfo}>
                          <Text style={styles.invoiceNumber} numberOfLines={1}>
                            {inv.invoice_number}
                          </Text>
                          <Text style={styles.invoiceCustomer} numberOfLines={1}>
                            {inv.customer_name ?? 'Không rõ KH'}
                          </Text>
                          <Text style={styles.invoiceDate}>
                            {new Date(inv.invoice_date).toLocaleDateString('vi-VN')}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.invoiceRight}>
                        <Text style={styles.invoiceAmount}>{formatCurrency(inv.total_amount)}</Text>
                        <View style={[styles.badge, { backgroundColor: ps.bg }]}>
                          <Text style={[styles.badgeText, { color: ps.color }]}>{ps.label}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: st.bg }]}>
                          <Text style={[styles.badgeText, { color: st.color }]}>{st.label}</Text>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function StatCard({ title, icon, value, color, bg, onPress }: any) {
  return (
    <TouchableOpacity style={styles.metricCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        <View style={[styles.metricIconContainer, { backgroundColor: bg }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
      </View>
      <Text style={styles.metricValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </TouchableOpacity>
  )
}

function QuickActionButton({ title, icon, color, iconColor, onPress }: any) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionIconContainer}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
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
    paddingTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    flex: 1,
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  actionsContainer: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#374151',
  },
  recentContainer: {
    paddingTop: 8,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: INDIGO,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  invoiceList: {
    gap: 10,
  },
  invoiceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  invoiceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  invoiceCustomer: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  invoiceDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  invoiceRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  invoiceAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f46e5',
    marginBottom: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
})
