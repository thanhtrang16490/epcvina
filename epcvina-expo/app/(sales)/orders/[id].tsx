import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'
import ConfirmModal from '../../../src/components/ConfirmModal'
import SuccessModal from '../../../src/components/SuccessModal'
import { exportInvoicePDF } from '../../../src/lib/pdf-invoice'

const statusMap: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  draft: { label: 'Đơn nháp', color: '#374151', bg: '#f3f4f6', icon: 'document-outline' },
  ordered: { label: 'Đơn đặt hàng', color: '#d97706', bg: '#fef3c7', icon: 'cart' },
  shipping: { label: 'Giao hàng', color: '#2563eb', bg: '#dbeafe', icon: 'car' },
  paid: { label: 'Thanh toán', color: '#9333ea', bg: '#f3e8ff', icon: 'card' },
  completed: { label: 'Hoàn thành', color: '#059669', bg: '#d1fae5', icon: 'checkmark-circle' },
  cancelled: { label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2', icon: 'close-circle' }
}

const getNextStatus = (currentStatus: string) => {
  const statusFlow: Record<string, { status: string; label: string; color: string }> = {
    draft: { status: 'ordered', label: 'Đặt hàng', color: '#d97706' },
    ordered: { status: 'shipping', label: 'Giao hàng', color: '#2563eb' },
    shipping: { status: 'paid', label: 'Thanh toán', color: '#9333ea' },
    paid: { status: 'completed', label: 'Hoàn thành', color: '#059669' },
  }
  return statusFlow[currentStatus]
}

export default function OrderDetailScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [profile, setProfile] = useState<any>(null)
  const [order, setOrder] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [exportingPDF, setExportingPDF] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

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

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      if (!profileData || !['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
        Alert.alert('Lỗi', 'Bạn không có quyền truy cập')
        router.back()
        return
      }

      setProfile(profileData)

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      if (orderError || !orderData) {
        Alert.alert('Lỗi', 'Không tìm thấy đơn hàng')
        router.back()
        return
      }

      // Fetch customer info
      let customerInfo = null
      if (orderData.customer_id) {
        const { data: customerData } = await supabase
          .from('profiles')
          .select('full_name, phone, email, address')
          .eq('id', orderData.customer_id)
          .single()
        customerInfo = customerData
      }

      // Fetch sale info
      let saleInfo = null
      if (orderData.sale_id) {
        const { data: saleData } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', orderData.sale_id)
          .single()
        saleInfo = saleData
      }

      setOrder({
        ...orderData,
        customer: customerInfo,
        sale: saleInfo,
      })

      // Fetch order items
      const { data: itemsData } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            name,
            code,
            image_url
          )
        `)
        .eq('order_id', id)

      setOrderItems(itemsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setUpdating(true)
      
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Show success modal for important status changes
      const statusMessages: Record<string, string> = {
        ordered: 'Đơn hàng đã được đặt thành công!',
        shipping: 'Đơn hàng đang được giao!',
        paid: 'Đơn hàng đã được thanh toán!',
        completed: 'Đơn hàng đã hoàn thành!',
      }

      if (statusMessages[newStatus]) {
        setSuccessMessage(statusMessages[newStatus])
        setShowSuccessModal(true)
      } else {
        Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng')
      }
      
      fetchData()
    } catch (error) {
      console.error('Error updating order:', error)
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái')
    } finally {
      setUpdating(false)
    }
  }

  const handleExportPDF = async () => {
    if (!order) return
    try {
      setExportingPDF(true)
      const success = await exportInvoicePDF(order, orderItems)
      if (!success) {
        Alert.alert('Lỗi', 'Không thể xuất PDF trên thiết bị này')
      }
    } finally {
      setExportingPDF(false)
    }
  }

  const handleCancelOrder = () => {
    setShowCancelModal(true)
  }

  const confirmCancelOrder = async () => {
    try {
      setUpdating(true)
      
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error

      setShowCancelModal(false)
      Alert.alert('Thành công', 'Đã hủy đơn hàng')
      fetchData()
    } catch (error) {
      console.error('Error cancelling order:', error)
      Alert.alert('Lỗi', 'Không thể hủy đơn hàng')
    } finally {
      setUpdating(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy đơn hàng</Text>
      </View>
    )
  }

  const statusConfig = statusMap[order.status] || statusMap.draft
  const nextStatus = getNextStatus(order.status)
  const isAdmin = profile?.role === 'admin'

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExportPDF}
          disabled={exportingPDF || !order}
        >
          {exportingPDF ? (
            <ActivityIndicator size="small" color="#175ead" />
          ) : (
            <Ionicons name="share-outline" size={22} color="#175ead" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Order Header Card */}
        <View style={styles.orderHeaderCard}>
          <View style={[styles.orderHeaderTop, { backgroundColor: statusConfig.bg }]} />
          
          <View style={styles.orderHeaderContent}>
            <View style={styles.orderHeaderLeft}>
              <View style={[styles.orderIcon, { backgroundColor: statusConfig.bg }]}>
                <Ionicons name={statusConfig.icon as any} size={32} color={statusConfig.color} />
              </View>
              <View style={styles.orderHeaderInfo}>
                <Text style={styles.orderNumber}>Đơn hàng #{order.id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.created_at).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        {order.customer && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            <View style={styles.customerInfo}>
              <View style={styles.customerAvatar}>
                <Ionicons name="person" size={24} color="#175ead" />
              </View>
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>{order.customer.full_name}</Text>
                {order.customer.phone && (
                  <View style={styles.infoRow}>
                    <Ionicons name="call" size={14} color="#6b7280" />
                    <Text style={styles.infoText}>{order.customer.phone}</Text>
                  </View>
                )}
                {order.customer.address && (
                  <View style={styles.infoRow}>
                    <Ionicons name="location" size={14} color="#6b7280" />
                    <Text style={styles.infoText}>{order.customer.address}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Sale Info */}
        {order.sale && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Nhân viên phụ trách</Text>
            <View style={styles.saleInfo}>
              <View style={styles.saleAvatar}>
                <Ionicons name="person-circle" size={24} color="#6366f1" />
              </View>
              <View style={styles.saleDetails}>
                <Text style={styles.saleName}>{order.sale.full_name}</Text>
                {order.sale.phone && (
                  <Text style={styles.salePhone}>{order.sale.phone}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Sản phẩm ({orderItems.length})</Text>
          {orderItems.map((item, index) => (
            <View key={item.id} style={[styles.orderItem, index > 0 && styles.orderItemBorder]}>
              <View style={styles.orderItemLeft}>
                <View style={styles.itemIcon}>
                  <Ionicons name="cube" size={20} color="#175ead" />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.products?.name || 'Sản phẩm'}</Text>
                  {item.products?.code && (
                    <Text style={styles.itemCode}>Mã: {item.products.code}</Text>
                  )}
                  <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                </View>
              </View>
              <View style={styles.orderItemRight}>
                <Text style={styles.itemPrice}>{formatCurrency(item.price_at_order)}</Text>
                <Text style={styles.itemTotal}>
                  {formatCurrency(item.price_at_order * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Tổng kết đơn hàng</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.total_amount)}</Text>
          </View>
          
          {order.discount_amount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Giảm giá</Text>
              <Text style={[styles.summaryValue, { color: '#ef4444' }]}>
                -{formatCurrency(order.discount_amount)}
              </Text>
            </View>
          )}
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
            <Text style={styles.summaryTotalValue}>
              {formatCurrency(order.total_amount - (order.discount_amount || 0))}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {order.notes && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        {order.status !== 'completed' && order.status !== 'cancelled' && (
          <View style={styles.actionsContainer}>
            {nextStatus && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: nextStatus.color }]}
                onPress={() => handleUpdateStatus(nextStatus.status)}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                    <Text style={styles.actionButtonText}>{nextStatus.label}</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
            
            {order.status === 'draft' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelOrder}
                disabled={updating}
              >
                <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                <Text style={styles.cancelButtonText}>Hủy đơn</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        visible={showCancelModal}
        title="Xác nhận hủy đơn"
        message={`Bạn có chắc chắn muốn hủy đơn hàng #${order?.id}? Hành động này không thể hoàn tác.`}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancelOrder}
        confirmText="Hủy đơn"
        cancelText="Quay lại"
        type="danger"
        loading={updating}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Cập nhật thành công!"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
        primaryButton={{
          text: 'Đóng',
          onPress: () => setShowSuccessModal(false)
        }}
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
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  exportButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  orderHeaderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeaderTop: {
    height: 8,
  },
  orderHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  orderIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#f0f9ff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
  },
  saleInfo: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  saleAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saleDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  saleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  salePhone: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  orderItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  orderItemLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  itemCode: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderItemRight: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#175ead',
  },
  notesText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fef2f2',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
})
