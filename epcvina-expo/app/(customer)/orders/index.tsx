import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import CustomerHeader from '../../../src/components/CustomerHeader'
import SuccessModal from '../../../src/components/SuccessModal'
import { emitScrollVisibility } from '../_layout'
import { getOrCreateCustomer } from '../../../src/lib/customer-helper'

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Đơn nháp', color: '#374151', bg: '#f3f4f6' },
  ordered: { label: 'Đơn đặt hàng', color: '#d97706', bg: '#fef3c7' },
  shipping: { label: 'Giao hàng', color: '#2563eb', bg: '#dbeafe' },
  paid: { label: 'Thanh toán', color: '#9333ea', bg: '#f3e8ff' },
  completed: { label: 'Hoàn thành', color: '#059669', bg: '#d1fae5' },
  cancelled: { label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2' }
}

const tabs = [
  { id: 'draft', label: 'Nháp' },
  { id: 'ordered', label: 'Đặt hàng' },
  { id: 'shipping', label: 'Giao hàng' },
  { id: 'paid', label: 'Thanh toán' },
  { id: 'completed', label: 'Hoàn thành' },
]

export default function OrdersScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('draft')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updating, setUpdating] = useState<number | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const lastScrollY = useRef<number>(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

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

useEffect(() => {
    fetchData()
  }, [])

  // Auto refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  // Auto refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!loading && !refreshing) {
        fetchData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  const fetchData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      // Fetch orders for customer
      await fetchOrders(authUser.id)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchOrders = async (userId: string) => {
    try {
      // Get or create customer record
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single()

      if (!profile) return

      const customerId = await getOrCreateCustomer({
        id: userData.user.id,
        email: userData.user.email,
        phone: userData.user.phone,
        full_name: profile.full_name,
        role: profile.role,
      })

      if (!customerId) {
        console.error('Failed to get/create customer')
        setOrders([])
        return
      }

      // Fetch orders using customer.id
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch sale info from profiles if exists
      if (data && data.length > 0) {
        const saleIds = [...new Set(data.map((o: any) => o.sale_id).filter(Boolean))]
        
        let profilesMap: any = {}
        if (saleIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, phone')
            .in('id', saleIds)
          
          profiles?.forEach((p: any) => {
            profilesMap[p.id] = p
          })
        }

        // Merge data
        const ordersWithRelations = data.map((order: any) => ({
          ...order,
          sale: order.sale_id ? {
            full_name: profilesMap[order.sale_id]?.full_name,
          } : null,
        }))

        setOrders(ordersWithRelations)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }

  const getFilteredOrders = () => {
    return orders.filter(order => order.status === activeTab)
  }

  const handleConfirmOrder = async (orderId: number) => {
    try {
      setUpdating(orderId)
      
      if (!user?.id) return

      // Get or create customer record
      const customerId = await getOrCreateCustomer(user)
      if (!customerId) {
        Alert.alert('Lỗi', 'Không thể xác định thông tin khách hàng')
        return
      }

      const { error } = await supabase
        .from('orders')
        .update({ status: 'ordered' })
        .eq('id', orderId)
        .eq('customer_id', customerId) // Security: only update own orders

      if (error) throw error

      setSuccessMessage('Đơn hàng đã được xác nhận!')
      setShowSuccessModal(true)

      // Refresh orders
      if (user) {
        await fetchOrders(user.id)
      }
    } catch (error) {
      console.error('Error confirming order:', error)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  const filteredOrders = getFilteredOrders()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <CustomerHeader />

      {/* Page Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
            <Text style={styles.headerSubtitle}>Theo dõi trạng thái đơn hàng</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(customer)/selling')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bag-handle-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const config = statusMap[order.status] || statusMap.draft
            
            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Info */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderLeft}>
                    <View style={styles.orderIcon}>
                      <Ionicons name="bag-handle" size={20} color="#10b981" />
                    </View>
                    <View style={styles.orderInfo}>
                      <View style={styles.orderTitleRow}>
                        <Text style={styles.orderTitle}>Đơn hàng #{order.id}</Text>
                        <View style={[styles.badge, { backgroundColor: config.bg }]}>
                          <Text style={[styles.badgeText, { color: config.color }]}>
                            {config.label}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.orderMeta}>
                        <Text style={styles.orderMetaText}>#{order.id}</Text>
                        <Text style={styles.orderMetaText}>•</Text>
                        <Text style={styles.orderMetaText}>
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </Text>
                      </View>
                      {order.sale && (
                        <Text style={styles.saleName}>NV: {order.sale.full_name}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderAmount}>
                      {formatCurrency(order.total_amount)}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.orderActions}>
                  <TouchableOpacity 
                    style={styles.actionButtonOutline}
                    onPress={() => router.push(`/(customer)/orders/${order.id}`)}
                  >
                    <Text style={styles.actionButtonOutlineText}>Chi tiết</Text>
                  </TouchableOpacity>
                  
                  {order.status === 'draft' && (
                    <TouchableOpacity 
                      style={[
                        styles.actionButton,
                        updating === order.id && styles.actionButtonDisabled
                      ]}
                      onPress={() => handleConfirmOrder(order.id)}
                      disabled={updating === order.id}
                    >
                      {updating === order.id ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={styles.actionButtonText}>Đặt hàng</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )
          })
        )}
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thành công!"
        message={successMessage}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  header: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#10b981',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    marginTop: 8,
  },
  tabsContent: {
    gap: 8,
    paddingRight: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 36,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#10b981',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
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
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  orderMetaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  saleName: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonOutline: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  actionButtonOutlineText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
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
