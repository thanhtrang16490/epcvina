import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LAYOUT } from '../../constants/layout'
import { COLORS, getStatusColor } from '../../constants/colors'

const { PADDING: SPACING, RADIUS } = LAYOUT

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  customers?: {
    full_name: string
    phone: string
  }
}

interface RecentOrdersProps {
  orders: Order[]
  onOrderPress: (orderId: string) => void
  onViewAll: () => void
}

/**
 * Component hiển thị danh sách đơn hàng gần đây
 * @param orders - Mảng các đơn hàng
 * @param onOrderPress - Handler khi click vào đơn hàng
 * @param onViewAll - Handler khi click "Xem tất cả"
 */
export default function RecentOrders({ orders, onOrderPress, onViewAll }: RecentOrdersProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    }
    return statusMap[status] || status
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {orders.map(order => (
        <TouchableOpacity
          key={order.id}
          style={styles.orderCard}
          onPress={() => onOrderPress(order.id)}
        >
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>#{order.order_number}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.status).bg },
              ]}
            >
              <Text style={[styles.statusText, { color: getStatusColor(order.status).color }]}>
                {getStatusLabel(order.status)}
              </Text>
            </View>
          </View>

          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                {order.customers?.full_name || 'Khách hàng'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{formatDate(order.created_at)}</Text>
            </View>
          </View>

          <View style={styles.orderFooter}>
            <Text style={styles.amountLabel}>Tổng tiền:</Text>
            <Text style={styles.amountValue}>{formatCurrency(order.total_amount)}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.LARGE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: COLORS.PRIMARY.DEFAULT,
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: RADIUS.MEDIUM,
    padding: SPACING.MEDIUM,
    marginBottom: SPACING.SMALL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: SPACING.TINY,
    borderRadius: RADIUS.SMALL,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderInfo: {
    marginBottom: SPACING.SMALL,
    gap: SPACING.TINY,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.TINY,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.SMALL,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY.DEFAULT,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.XLARGE,
    backgroundColor: 'white',
    borderRadius: RADIUS.MEDIUM,
  },
  emptyText: {
    marginTop: SPACING.SMALL,
    fontSize: 14,
    color: '#999',
  },
})
