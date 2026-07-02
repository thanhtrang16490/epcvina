import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'
import SuccessModal from '../../src/components/SuccessModal'

export default function WarehouseOrdersScreen() {
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [processing, setProcessing] = useState<number | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchOrders()
    }, [])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchOrders().finally(() => setRefreshing(false))
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      // Fetch orders with status 'ordered' (waiting to ship)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(full_name, phone, email, company),
          sale:profiles!orders_sale_id_fkey(full_name)
        `)
        .eq('status', 'ordered')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleShipOrder = async (orderId: number) => {
    Alert.alert(
      'Xác nhận xuất kho',
      'Bạn có chắc chắn muốn xác nhận xuất kho đơn hàng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              setProcessing(orderId)
              
              const { error } = await supabase
                .from('orders')
                .update({ 
                  status: 'shipping',
                  updated_at: new Date().toISOString()
                })
                .eq('id', orderId)

              if (error) throw error

              setShowSuccessModal(true)
              fetchOrders()
            } catch (error) {
              console.error('Error shipping order:', error)
              Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng')
            } finally {
              setProcessing(null)
            }
          }
        }
      ]
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' VNĐ'
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Đơn hàng chờ xuất</Text>
            <Text style={styles.headerSubtitle}>
              {orders.length} đơn hàng cần xử lý
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="cube" size={24} color="#f59e0b" />
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.content, { paddingBottom: contentPaddingBottom }]}>
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Không có đơn hàng chờ xuất</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderLeft}>
                    <View style={styles.orderIcon}>
                      <Ionicons name="bag-handle" size={20} color="#f59e0b" />
                    </View>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderTitle}>Đơn hàng #{order.id}</Text>
                      <Text style={styles.orderDate}>
                        {new Date(order.created_at).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                      {order.customer && (
                        <Text style={styles.customerName}>
                          <Ionicons name="person" size={12} /> {order.customer.full_name}
                        </Text>
                      )}
                      {order.sale && (
                        <Text style={styles.saleName}>
                          <Ionicons name="briefcase" size={12} /> {order.sale.full_name}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderAmount}>
                      {formatCurrency(order.total_amount)}
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Chờ xuất</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.orderActions}>
                  <TouchableOpacity 
                    style={styles.actionButtonOutline}
                    onPress={() => router.push(`/(sales-pages)/orders/${order.id}`)}
                  >
                    <Ionicons name="eye" size={16} color="#6b7280" />
                    <Text style={styles.actionButtonOutlineText}>Chi tiết</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.actionButton,
                      processing === order.id && styles.actionButtonDisabled
                    ]}
                    onPress={() => handleShipOrder(order.id)}
                    disabled={processing === order.id}
                  >
                    {processing === order.id ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={16} color="white" />
                        <Text style={styles.actionButtonText}>Xuất kho</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Xuất kho thành công!"
        message="Đơn hàng đã được chuyển sang trạng thái giao hàng"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
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
    backgroundColor: '#fffbeb',
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
    backgroundColor: '#fef3c7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  orderIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
    gap: 4,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  customerName: {
    fontSize: 12,
    color: '#6b7280',
  },
  saleName: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f59e0b',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  actionButtonOutlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f59e0b',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
})
