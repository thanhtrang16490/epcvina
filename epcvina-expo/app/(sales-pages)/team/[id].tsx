import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import AppHeader from '../../../src/components/AppHeader'

export default function TeamMemberDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [member, setMember] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      // Fetch member profile
      const { data: memberData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      setMember(memberData)

      // Fetch customers assigned to this member
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .eq('assigned_to', id)
        .order('created_at', { ascending: false })
        .limit(10)

      setCustomers(customersData || [])

      // Fetch orders created by this member
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, customer:customers(*)')
        .eq('created_by', id)
        .order('created_at', { ascending: false })
        .limit(10)

      setOrders(ordersData || [])

      // Calculate stats
      const { count: customersCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('assigned_to', id)

      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', id)

      const { count: completedCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', id)
        .eq('status', 'completed')

      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', id)
        .eq('status', 'pending')

      const { data: revenueData } = await supabase
        .from('orders')
        .select('total')
        .eq('created_by', id)
        .eq('status', 'completed')

      const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

      setStats({
        totalCustomers: customersCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        completedOrders: completedCount || 0,
        pendingOrders: pendingCount || 0,
      })
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  if (!member) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy thành viên</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Logo */}
      <AppHeader />
      
      {/* Page Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết thành viên</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Member Info Card */}
        <View style={styles.memberCard}>
          <View style={styles.memberIcon}>
            <Ionicons name="person" size={48} color="#175ead" />
          </View>
          <Text style={styles.memberName}>{member.full_name || 'No Name'}</Text>
          <Text style={styles.memberPhone}>{member.phone || '---'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>SALE</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Thống kê</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="person" size={24} color="#10b981" />
              <Text style={styles.statValue}>{stats.totalCustomers}</Text>
              <Text style={styles.statLabel}>Khách hàng</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="receipt" size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{stats.totalOrders}</Text>
              <Text style={styles.statLabel}>Đơn hàng</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.statValue}>{stats.completedOrders}</Text>
              <Text style={styles.statLabel}>Hoàn thành</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{stats.pendingOrders}</Text>
              <Text style={styles.statLabel}>Chờ xử lý</Text>
            </View>
          </View>
          <View style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>Tổng doanh thu</Text>
            <Text style={styles.revenueValue}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(stats.totalRevenue)}
            </Text>
          </View>
        </View>

        {/* Recent Customers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Khách hàng gần đây</Text>
            <Text style={styles.sectionCount}>({customers.length})</Text>
          </View>
          {customers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Chưa có khách hàng</Text>
            </View>
          ) : (
            customers.map((customer) => (
              <View key={customer.id} style={styles.listItem}>
                <View style={styles.listItemIcon}>
                  <Ionicons name="person-outline" size={20} color="#175ead" />
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{customer.name}</Text>
                  <Text style={styles.listItemSubtitle}>{customer.phone}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            ))
          )}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
            <Text style={styles.sectionCount}>({orders.length})</Text>
          </View>
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Chưa có đơn hàng</Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.listItem}>
                <View style={styles.listItemIcon}>
                  <Ionicons name="receipt-outline" size={20} color="#f59e0b" />
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>
                    {order.customer?.name || 'Unknown'}
                  </Text>
                  <Text style={styles.listItemSubtitle}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(order.total || 0)}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  order.status === 'completed' && styles.statusBadgeCompleted,
                  order.status === 'pending' && styles.statusBadgePending,
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {order.status === 'completed' ? 'Hoàn thành' : 
                     order.status === 'pending' ? 'Chờ xử lý' : order.status}
                  </Text>
                </View>
              </View>
            ))
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  memberCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  memberIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  memberPhone: {
    fontSize: 16,
    color: '#6b7280',
  },
  roleBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#175ead',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  revenueCard: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  revenueLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  revenueValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
    gap: 4,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  statusBadgeCompleted: {
    backgroundColor: '#dcfce7',
  },
  statusBadgePending: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
})
