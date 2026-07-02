import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'

export default function WarehouseDashboard() {
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const [stats, setStats] = useState({
    pendingOrders: 0,
    lowStockCount: 0,
    totalProducts: 0,
    todayShipped: 0
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchData().finally(() => setRefreshing(false))
  }

  const fetchData = async () => {
    try {
      setLoading(true)

      // Pending orders (ordered status - waiting to ship)
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ordered')

      // Low stock products
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 20)

      // Total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Today shipped (shipping status created today)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: shippedCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'shipping')
        .gte('updated_at', today.toISOString())

      setStats({
        pendingOrders: pendingCount || 0,
        lowStockCount: lowStockCount || 0,
        totalProducts: totalProducts || 0,
        todayShipped: shippedCount || 0
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
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
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AppHeader />

        {/* Page Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Quản lý kho</Text>
              <Text style={styles.headerSubtitle}>Tổng quan hoạt động kho hàng</Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="cube" size={24} color="#f59e0b" />
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={[styles.content, { paddingBottom: contentPaddingBottom }]}>
          <View style={styles.statsGrid}>
            <MetricCard 
              title="Đơn chờ xuất" 
              icon="cube" 
              value={stats.pendingOrders.toString()} 
              color="#f59e0b" 
              bg="#fef3c7" 
            />
            <MetricCard 
              title="Hàng sắp hết" 
              icon="warning" 
              value={stats.lowStockCount.toString()} 
              color="#ef4444" 
              bg="#fee2e2" 
            />
            <MetricCard 
              title="Tổng sản phẩm" 
              icon="pricetags" 
              value={stats.totalProducts.toString()} 
              color="#10b981" 
              bg="#d1fae5" 
            />
            <MetricCard 
              title="Xuất hôm nay" 
              icon="checkmark-circle" 
              value={stats.todayShipped.toString()} 
              color="#2563eb" 
              bg="#dbeafe" 
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.actionsTitle}>Thao tác nhanh</Text>
            <View style={styles.actionsGrid}>
              <QuickActionButton 
                title="Nhập kho" 
                icon="download" 
                color="#fef3c7" 
                iconColor="#f59e0b" 
                onPress={() => router.push('/(warehouse)/stock-in')}
              />
              <QuickActionButton 
                title="Đơn chờ xuất" 
                icon="cube" 
                color="#fef3c7" 
                iconColor="#f59e0b" 
                onPress={() => router.push('/(warehouse)/orders')}
              />
              <QuickActionButton 
                title="Sản phẩm" 
                icon="pricetags" 
                color="#d1fae5" 
                iconColor="#10b981" 
                onPress={() => router.push('/(warehouse)/products')}
              />
              <QuickActionButton 
                title="Hàng sắp hết" 
                icon="warning" 
                color="#fee2e2" 
                iconColor="#ef4444" 
                onPress={() => router.push('/(warehouse)/products?filter=low')}
              />
              <QuickActionButton 
                title="Báo cáo" 
                icon="bar-chart" 
                color="#e0e7ff" 
                iconColor="#6366f1" 
                onPress={() => router.push('/(warehouse)/reports')}
              />
              <QuickActionButton 
                title="Lịch sử kho" 
                icon="time" 
                color="#fef3c7" 
                iconColor="#f59e0b" 
                onPress={() => router.push('/(warehouse)/history')}
              />
              <QuickActionButton 
                title="Sản xuất" 
                icon="construct" 
                color="#fef3c7" 
                iconColor="#f59e0b" 
                onPress={() => router.push('/(warehouse)/production')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function MetricCard({ title, icon, value, color, bg }: any) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        <View style={[styles.metricIconContainer, { backgroundColor: bg }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  actionsContainer: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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
})
