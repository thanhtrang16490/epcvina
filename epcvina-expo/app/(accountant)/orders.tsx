import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'

const INDIGO = '#4f46e5'

interface OrderNeedingInvoice {
  id: string
  customer_name: string | null
  total_amount: number
  status: string
  created_at: string
}

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: 'Đã TT', color: '#9333ea', bg: '#f3e8ff' },
  completed: { label: 'Hoàn thành', color: '#059669', bg: '#d1fae5' },
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' VNĐ'

export default function OrdersScreen() {
  const { contentPaddingBottom } = useTabBarHeight()
  const [orders, setOrders] = useState<OrderNeedingInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [creating, setCreating] = useState<string | null>(null)
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

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          profiles:customer_id ( full_name )
        `)
        .in('status', ['paid', 'completed'])
        .is('invoice_id', null)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setOrders(
        (data || []).map((o: any) => ({
          id: o.id,
          customer_name: o.profiles?.full_name ?? null,
          total_amount: o.total_amount,
          status: o.status,
          created_at: o.created_at,
        }))
      )
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!refreshing) fetchOrders()
    }, [refreshing])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchOrders().finally(() => setRefreshing(false))
  }

  const handleCreateInvoice = async (orderId: string) => {
    Alert.alert(
      'Lập hóa đơn',
      'Bạn có chắc muốn lập hóa đơn cho đơn hàng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Lập HĐ',
          style: 'default',
          onPress: async () => {
            try {
              setCreating(orderId)

              // Get order details for invoice
              const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('id, customer_id, total_amount')
                .eq('id', orderId)
                .single()

              if (orderError) throw orderError
              if (!orderData) throw new Error('Order not found')

              // Generate invoice number: HD-YYYYMMDD-XXXX
              const now = new Date()
              const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
              const randomSuffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
              const invoiceNumber = `HD-${dateStr}-${randomSuffix}`

              // Create invoice record
              const { data: invoiceData, error: invoiceError } = await supabase
                .from('invoices')
                .insert({
                  order_id: orderId,
                  customer_id: orderData.customer_id,
                  invoice_number: invoiceNumber,
                  total_amount: orderData.total_amount,
                  status: 'draft',
                  payment_status: 'unpaid',
                  invoice_date: new Date().toISOString().split('T')[0],
                })
                .select('id')
                .single()

              if (invoiceError) throw invoiceError

              // Link order to invoice
              const { error: updateError } = await supabase
                .from('orders')
                .update({ invoice_id: invoiceData.id })
                .eq('id', orderId)

              if (updateError) throw updateError

              Alert.alert('Thành công', 'Đã lập hóa đơn thành công!', [
                { text: 'OK', onPress: () => fetchOrders() },
              ])
            } catch (error: any) {
              console.error('Error creating invoice:', error)
              Alert.alert('Lỗi', error.message || 'Không thể lập hóa đơn. Vui lòng thử lại.')
            } finally {
              setCreating(null)
            }
          },
        },
      ]
    )
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={INDIGO} />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Đơn hàng chờ lập HĐ</Text>
              <Text style={styles.headerSubtitle}>
                Các đơn đã thanh toán / hoàn thành chưa có hóa đơn
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="clipboard" size={24} color={INDIGO} />
            </View>
          </View>
        </View>

        {/* Results count */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>{orders.length} đơn chờ lập hóa đơn</Text>
        </View>

        {/* Order List */}
        <View style={[styles.listContainer, { paddingBottom: contentPaddingBottom }]}>
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              <Text style={styles.emptyStateTitle}>Tuyệt vời!</Text>
              <Text style={styles.emptyStateText}>Tất cả đơn hàng đã có hóa đơn</Text>
            </View>
          ) : (
            orders.map((order) => {
              const st = ORDER_STATUS_MAP[order.status] ?? {
                label: order.status,
                color: '#6b7280',
                bg: '#f3f4f6',
              }
              const isCreating = creating === order.id
              return (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderLeft}>
                    <View style={[styles.orderIconContainer, { backgroundColor: '#fef3c7' }]}>
                      <Ionicons name="receipt" size={20} color="#d97706" />
                    </View>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderNumber} numberOfLines={1}>
                        Đơn #{order.id.slice(0, 8)}
                      </Text>
                      <Text style={styles.orderCustomer} numberOfLines={1}>
                        {order.customer_name ?? 'Không rõ KH'}
                      </Text>
                      <View style={styles.orderMeta}>
                        <Text style={styles.orderDate}>
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </Text>
                        <View style={[styles.badge, { backgroundColor: st.bg }]}>
                          <Text style={[styles.badgeText, { color: st.color }]}>{st.label}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderAmount}>{formatCurrency(order.total_amount)}</Text>
                    <TouchableOpacity
                      style={[styles.createInvoiceBtn, isCreating && styles.createInvoiceBtnDisabled]}
                      onPress={() => handleCreateInvoice(order.id)}
                      disabled={isCreating}
                      activeOpacity={0.7}
                    >
                      {isCreating ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={styles.createInvoiceBtnText}>Lập hóa đơn</Text>
                      )}
                    </TouchableOpacity>
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
  countRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  countText: {
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
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  orderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  orderCustomer: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderDate: {
    fontSize: 11,
    color: '#9ca3af',
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
  orderRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  createInvoiceBtn: {
    backgroundColor: INDIGO,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createInvoiceBtnDisabled: {
    opacity: 0.6,
  },
  createInvoiceBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
})