import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'

const INDIGO = '#4f46e5'

interface Invoice {
  id: string
  invoice_number: string
  customer_name: string | null
  total_amount: number
  payment_status: string
  invoice_date: string
  status: string
}

const STATUS_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'draft', label: 'Nháp' },
  { id: 'issued', label: 'Đã phát hành' },
  { id: 'sent', label: 'Đã gửi' },
  { id: 'cancelled', label: 'Đã hủy' },
]

const PAYMENT_FILTERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unpaid', label: 'Chưa TT' },
  { id: 'partial', label: 'Một phần' },
  { id: 'paid', label: 'Đã TT' },
  { id: 'overdue', label: 'Quá hạn' },
]

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

export default function InvoicesScreen() {
  const { contentPaddingBottom } = useTabBarHeight()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeStatusTab, setActiveStatusTab] = useState('all')
  const [activePaymentFilter, setActivePaymentFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
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

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      let query = supabase
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
        .limit(100)

      if (activeStatusTab !== 'all') {
        query = query.eq('status', activeStatusTab)
      }

      if (activePaymentFilter !== 'all') {
        query = query.eq('payment_status', activePaymentFilter)
      }

      const { data, error } = await query

      if (error) throw error

      let mapped: Invoice[] = (data || []).map((inv: any) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        customer_name: inv.profiles?.full_name ?? null,
        total_amount: inv.total_amount,
        payment_status: inv.payment_status,
        invoice_date: inv.invoice_date,
        status: inv.status,
      }))

      // Client-side search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        mapped = mapped.filter(
          (inv) =>
            inv.invoice_number?.toLowerCase().includes(q) ||
            inv.customer_name?.toLowerCase().includes(q)
        )
      }

      setInvoices(mapped)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [activeStatusTab, activePaymentFilter])

  useFocusEffect(
    useCallback(() => {
      if (!refreshing) fetchInvoices()
    }, [refreshing, activeStatusTab, activePaymentFilter])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchInvoices().finally(() => setRefreshing(false))
  }

  const handleSearch = () => {
    fetchInvoices()
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={INDIGO} />
        <Text style={styles.loadingText}>Đang tải hóa đơn...</Text>
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
        stickyHeaderIndices={[0]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hóa đơn</Text>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm hóa đơn, khách hàng..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>

          {/* Status Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
            {STATUS_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeStatusTab === tab.id && styles.tabActive]}
                onPress={() => setActiveStatusTab(tab.id)}
              >
                <Text style={[styles.tabText, activeStatusTab === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Payment Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {PAYMENT_FILTERS.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterChip, activePaymentFilter === f.id && styles.filterChipActive]}
                onPress={() => setActivePaymentFilter(f.id)}
              >
                <Text style={[styles.filterChipText, activePaymentFilter === f.id && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results count */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsCount}>{invoices.length} hóa đơn</Text>
        </View>

        {/* Invoice List */}
        <View style={[styles.listContainer, { paddingBottom: contentPaddingBottom }]}>
          {invoices.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>Không có hóa đơn nào</Text>
            </View>
          ) : (
            invoices.map((inv) => {
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
            })
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
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  tabContainer: {
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'white',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabActive: {
    backgroundColor: INDIGO,
    borderColor: INDIGO,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: 'white',
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'white',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#e0e7ff',
    borderColor: INDIGO,
  },
  filterChipText: {
    fontSize: 11,
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: INDIGO,
    fontWeight: '600',
  },
  resultsRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: '#6b7280',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 10,
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
