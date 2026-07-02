/**
 * Optimistic Order Status Component
 * Example integration of Phase 3 optimistic updates
 */

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { OptimisticUpdates } from '../lib/optimistic-updates'
import { Analytics, AnalyticsEvents } from '../lib/analytics'
import { supabase } from '../lib/supabase'

interface Order {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  customer_name: string
  total: number
}

interface OptimisticOrderStatusProps {
  order: Order
  onUpdate?: (order: Order) => void
}

const STATUS_LABELS = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

const STATUS_COLORS = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  completed: '#10b981',
  cancelled: '#ef4444',
}

export function OptimisticOrderStatus({ order, onUpdate }: OptimisticOrderStatusProps) {
  const [currentOrder, setCurrentOrder] = useState(order)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (newStatus === currentOrder.status) return

    setUpdating(true)

    // Track status change
    Analytics.trackEvent(AnalyticsEvents.ORDER_UPDATED, {
      order_id: currentOrder.id,
      old_status: currentOrder.status,
      new_status: newStatus,
    })

    // Apply optimistic update
    const result = await OptimisticUpdates.apply(
      `order-${currentOrder.id}`,
      'update_order_status',
      { ...currentOrder, status: newStatus },
      currentOrder,
      async () => {
        const { data, error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', currentOrder.id)
          .select()
          .single()

        if (error) throw error
        return data
      }
    )

    setUpdating(false)

    if (result.success) {
      // Update local state
      const updatedOrder = { ...currentOrder, status: newStatus }
      setCurrentOrder(updatedOrder)
      onUpdate?.(updatedOrder)

      Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng')
    } else {
      // Track error
      Analytics.trackError(result.error!, 'OptimisticOrderStatus')

      Alert.alert('Lỗi', result.error?.message || 'Không thể cập nhật trạng thái')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trạng thái đơn hàng</Text>
        {updating && <ActivityIndicator size="small" color="#175ead" />}
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.customerName}>{currentOrder.customer_name}</Text>
        <Text style={styles.total}>
          {currentOrder.total.toLocaleString('vi-VN')} đ
        </Text>
      </View>

      <View style={styles.statusButtons}>
        {(Object.keys(STATUS_LABELS) as Array<Order['status']>).map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => handleStatusChange(status)}
            disabled={updating || status === currentOrder.status}
            style={[
              styles.statusButton,
              currentOrder.status === status && {
                backgroundColor: STATUS_COLORS[status],
              },
              updating && styles.statusButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.statusButtonText,
                currentOrder.status === status && styles.statusButtonTextActive,
              ]}
            >
              {STATUS_LABELS[status]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={[
          styles.currentStatus,
          { backgroundColor: STATUS_COLORS[currentOrder.status] + '20' },
        ]}
      >
        <Text style={[styles.currentStatusText, { color: STATUS_COLORS[currentOrder.status] }]}>
          Trạng thái hiện tại: {STATUS_LABELS[currentOrder.status]}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  orderInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#175ead',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  statusButtonDisabled: {
    opacity: 0.5,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  statusButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  currentStatus: {
    padding: 12,
    borderRadius: 8,
  },
  currentStatusText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
})
