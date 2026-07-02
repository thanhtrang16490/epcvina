import { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import CustomerHeader from '../../src/components/CustomerHeader'
import StatusBadge from '../../src/components/shared/StatusBadge'
import { errorTracker } from '../../src/lib/error-tracking'
import { getOrCreateCustomer } from '../../src/lib/customer-helper'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      if (!user) return

      // Get or create customer record
      const customerId = await getOrCreateCustomer(user)
      
      if (!customerId) {
        console.warn('Failed to get/create customer record')
        setLoading(false)
        setRefreshing(false)
        return
      }

      // Fetch orders using customer.id
      const { data: allOrders, error } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const orders = allOrders ?? []

      setRecentOrders(orders.slice(0, 5))
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o =>
          ['draft', 'ordered', 'shipping'].includes(o.status)
        ).length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
      })
    } catch (error) {
      errorTracker.logError(error as Error, { action: 'CustomerDashboard.fetchData' })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const handleScroll = useCallback((event: any) => {
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
  }, [])

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
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomerHeader />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: contentPaddingBottom + 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Xin chào{user?.full_name ? `, ${user.full_name}` : ''}! 👋
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Chào mừng bạn đến với APPE JV
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="bag-handle" size={20} color="#175ead" />
              </View>
              <Text style={styles.statValue}>{stats.totalOrders}</Text>
              <Text style={styles.statLabel}>Tổng đơn</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="time" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.statValue}>{stats.pendingOrders}</Text>
              <Text style={styles.statLabel}>Đang xử lý</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#d1fae5' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              </View>
              <Text style={styles.statValue}>{stats.completedOrders}</Text>
              <Text style={styles.statLabel}>Hoàn thành</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(customer)/products')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="grid" size={24} color="#175ead" />
              </View>
              <Text style={styles.actionTitle}>Sản phẩm</Text>
              <Text style={styles.actionSubtitle}>Xem danh mục</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(customer)/orders')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#d1fae5' }]}>
                <Ionicons name="receipt" size={24} color="#10b981" />
              </View>
              <Text style={styles.actionTitle}>Đơn hàng</Text>
              <Text style={styles.actionSubtitle}>Theo dõi đơn</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(customer)/account')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="person" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.actionTitle}>Tài khoản</Text>
              <Text style={styles.actionSubtitle}>Thông tin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
            {recentOrders.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/(customer)/orders')}>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            )}
          </View>
          {recentOrders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="bag-handle-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
            </View>
          ) : (
            <View style={styles.ordersContainer}>
              {recentOrders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderCard}
                  onPress={() => router.push(`/(customer)/orders/${order.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.orderHeader}>
                    <View style={styles.orderLeft}>
                      <View style={styles.orderIcon}>
                        <Ionicons name="bag-handle" size={20} color="#10b981" />
                      </View>
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderTitle}>
                          Đơn #{String(order.id).slice(0, 8).toUpperCase()}
                        </Text>
                        <Text style={styles.orderDate}>
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.orderRight}>
                      <Text style={styles.orderAmount}>
                        {formatCurrency(order.total_amount)}
                      </Text>
                      <StatusBadge status={order.status} size="sm" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: '#9ca3af',
  },
  ordersContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
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
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
})
