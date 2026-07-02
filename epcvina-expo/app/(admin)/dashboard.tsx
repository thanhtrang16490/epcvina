import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Image, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch users count (exclude customers)
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .neq('role', 'customer')

      // Fetch customers count
      const { count: customersCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })

      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Fetch orders count
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      // Fetch pending orders count
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Fetch total revenue (completed orders)
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed')

      const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

      setStats({
        totalUsers: usersCount || 0,
        totalCustomers: customersCount || 0,
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        pendingOrders: pendingCount || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchStats()
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Logo */}
      <View style={styles.topHeader}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoTitle}>APPE JV</Text>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
        </View>
      </View>

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Tổng quan hệ thống</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* System Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thống kê hệ thống</Text>
          
          <View style={styles.statsGrid}>
            {/* Users */}
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: '#fef2f2' }]}
              onPress={() => router.push('/users' as any)}
            >
              <View style={[styles.statIcon, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="people" size={24} color="#ef4444" />
              </View>
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Nhân viên</Text>
            </TouchableOpacity>

            {/* Customers */}
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}
              onPress={() => router.push('/(sales)/customers')}
            >
              <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="person" size={24} color="#10b981" />
              </View>
              <Text style={styles.statValue}>{stats.totalCustomers}</Text>
              <Text style={styles.statLabel}>Khách hàng</Text>
            </TouchableOpacity>

            {/* Products */}
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: '#eff6ff' }]}
              onPress={() => router.push('/(sales)/inventory')}
            >
              <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="cube" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.statValue}>{stats.totalProducts}</Text>
              <Text style={styles.statLabel}>Sản phẩm</Text>
            </TouchableOpacity>

            {/* Orders */}
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: '#fef3c7' }]}
              onPress={() => router.push('/(sales)/orders')}
            >
              <View style={[styles.statIcon, { backgroundColor: '#fde68a' }]}>
                <Ionicons name="receipt" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.statValue}>{stats.totalOrders}</Text>
              <Text style={styles.statLabel}>Đơn hàng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Revenue & Pending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doanh thu & Đơn chờ</Text>
          
          <View style={styles.largeStatsGrid}>
            {/* Revenue */}
            <View style={[styles.largeStatCard, { backgroundColor: '#f0fdf4' }]}>
              <View style={styles.largeStatHeader}>
                <View style={[styles.largeStatIcon, { backgroundColor: '#dcfce7' }]}>
                  <Ionicons name="cash" size={28} color="#10b981" />
                </View>
                <Text style={styles.largeStatLabel}>Tổng doanh thu</Text>
              </View>
              <Text style={[styles.largeStatValue, { color: '#10b981' }]}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(stats.totalRevenue)}
              </Text>
              <Text style={styles.largeStatSubtext}>Từ {stats.totalOrders} đơn hàng</Text>
            </View>

            {/* Pending Orders */}
            <View style={[styles.largeStatCard, { backgroundColor: '#fef3c7' }]}>
              <View style={styles.largeStatHeader}>
                <View style={[styles.largeStatIcon, { backgroundColor: '#fde68a' }]}>
                  <Ionicons name="time" size={28} color="#f59e0b" />
                </View>
                <Text style={styles.largeStatLabel}>Đơn chờ xử lý</Text>
              </View>
              <Text style={[styles.largeStatValue, { color: '#f59e0b' }]}>
                {stats.pendingOrders}
              </Text>
              <Text style={styles.largeStatSubtext}>Cần xử lý ngay</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/users' as any)}
            >
              <Ionicons name="person-add" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Thêm nhân viên</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/categories' as any)}
            >
              <Ionicons name="pricetag-outline" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Quản lý danh mục</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/settings' as any)}
            >
              <Ionicons name="settings-outline" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Cài đặt hệ thống</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/analytics' as any)}
            >
              <Ionicons name="analytics-outline" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Xem phân tích</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/approvals' as any)}
            >
              <Ionicons name="checkmark-done" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Phê duyệt</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product & Pricing Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm & Giá cả</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/products' as any)}
            >
              <Ionicons name="cube-outline" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Sản phẩm</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/brands' as any)}
            >
              <Ionicons name="shield-outline" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Thương hiệu</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/discounts' as any)}
            >
              <Ionicons name="pricetag-outline" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Chiết khấu</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/gifts' as any)}
            >
              <Ionicons name="gift-outline" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Tặng quà</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/pricing' as any)}
            >
              <Ionicons name="cash-outline" size={24} color="#ef4444" />
              <Text style={styles.actionButtonText}>Giá đặc biệt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef2f2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fef2f2',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  adminBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  pageHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fef2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  largeStatsGrid: {
    gap: 12,
  },
  largeStatCard: {
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  largeStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  largeStatIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeStatLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    flex: 1,
  },
  largeStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  largeStatSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
})
