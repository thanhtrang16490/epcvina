import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

export default function AnalyticsScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [analytics, setAnalytics] = useState({
    revenue: { current: 0, previous: 0, change: 0 },
    orders: { current: 0, previous: 0, change: 0 },
    customers: { current: 0, previous: 0, change: 0 },
    avgOrderValue: { current: 0, previous: 0, change: 0 },
    topProducts: [] as any[],
    topCustomers: [] as any[],
    salesByCategory: [] as any[],
    revenueByDay: [] as any[]
  })

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      if (!profile || !['admin', 'sale_admin'].includes(profile.role)) {
        router.replace('/(sales)/dashboard')
        return
      }

      const { currentStart, currentEnd, previousStart, previousEnd } = getDateRanges()

      // Revenue analytics
      const [currentRevenue, previousRevenue] = await Promise.all([
        supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'completed')
          .gte('created_at', currentStart)
          .lt('created_at', currentEnd),
        supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'completed')
          .gte('created_at', previousStart)
          .lt('created_at', previousEnd)
      ])

      const currentRevenueTotal = currentRevenue.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
      const previousRevenueTotal = previousRevenue.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
      const revenueChange = previousRevenueTotal > 0 
        ? ((currentRevenueTotal - previousRevenueTotal) / previousRevenueTotal) * 100 
        : 0

      // Orders analytics
      const currentOrdersCount = currentRevenue.data?.length || 0
      const previousOrdersCount = previousRevenue.data?.length || 0
      const ordersChange = previousOrdersCount > 0
        ? ((currentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100
        : 0

      // Customers analytics
      const [currentCustomers, previousCustomers] = await Promise.all([
        supabase
          .from('customers')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', currentStart)
          .lt('created_at', currentEnd),
        supabase
          .from('customers')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', previousStart)
          .lt('created_at', previousEnd)
      ])

      const customersChange = (previousCustomers.count || 0) > 0
        ? (((currentCustomers.count || 0) - (previousCustomers.count || 0)) / (previousCustomers.count || 0)) * 100
        : 0

      // Average order value
      const avgCurrent = currentOrdersCount > 0 ? currentRevenueTotal / currentOrdersCount : 0
      const avgPrevious = previousOrdersCount > 0 ? previousRevenueTotal / previousOrdersCount : 0
      const avgChange = avgPrevious > 0 ? ((avgCurrent - avgPrevious) / avgPrevious) * 100 : 0

      // Top products
      const { data: topProducts } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          products (name, price)
        `)
        .gte('created_at', currentStart)
        .lt('created_at', currentEnd)

      const productSales = topProducts?.reduce((acc: any, item: any) => {
        const id = item.product_id
        if (!acc[id]) {
          acc[id] = {
            name: item.products?.name || 'Unknown',
            quantity: 0,
            revenue: 0
          }
        }
        acc[id].quantity += item.quantity
        acc[id].revenue += item.quantity * (item.products?.price || 0)
        return acc
      }, {})

      const topProductsList = Object.values(productSales || {})
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5)

      setAnalytics({
        revenue: { current: currentRevenueTotal, previous: previousRevenueTotal, change: revenueChange },
        orders: { current: currentOrdersCount, previous: previousOrdersCount, change: ordersChange },
        customers: { current: currentCustomers.count || 0, previous: previousCustomers.count || 0, change: customersChange },
        avgOrderValue: { current: avgCurrent, previous: avgPrevious, change: avgChange },
        topProducts: topProductsList,
        topCustomers: [],
        salesByCategory: [],
        revenueByDay: []
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateRanges = () => {
    const now = new Date()
    let currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date

    switch (timeRange) {
      case 'week':
        currentEnd = now
        currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousEnd = currentStart
        previousStart = new Date(currentStart.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        currentEnd = now
        currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
        previousEnd = currentStart
        previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        break
      case 'year':
        currentEnd = now
        currentStart = new Date(now.getFullYear(), 0, 1)
        previousEnd = currentStart
        previousStart = new Date(now.getFullYear() - 1, 0, 1)
        break
    }

    return {
      currentStart: currentStart.toISOString(),
      currentEnd: currentEnd.toISOString(),
      previousStart: previousStart.toISOString(),
      previousEnd: previousEnd.toISOString()
    }
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
        <ActivityIndicator size="large" color="#175ead" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phân tích dữ liệu</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonActive]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}>
                {range === 'week' ? '7 ngày' : range === 'month' ? 'Tháng này' : 'Năm này'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Doanh thu"
            value={formatCurrency(analytics.revenue.current)}
            change={analytics.revenue.change}
            icon="trending-up"
          />
          <MetricCard
            title="Đơn hàng"
            value={analytics.orders.current.toString()}
            change={analytics.orders.change}
            icon="receipt"
          />
          <MetricCard
            title="Khách hàng mới"
            value={analytics.customers.current.toString()}
            change={analytics.customers.change}
            icon="people"
          />
          <MetricCard
            title="Giá trị TB/đơn"
            value={formatCurrency(analytics.avgOrderValue.current)}
            change={analytics.avgOrderValue.change}
            icon="cash"
          />
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm bán chạy</Text>
          {analytics.topProducts.map((product: any, index: number) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <Text style={styles.listItemRank}>{index + 1}</Text>
                <View>
                  <Text style={styles.listItemTitle}>{product.name}</Text>
                  <Text style={styles.listItemSubtitle}>{product.quantity} đã bán</Text>
                </View>
              </View>
              <Text style={styles.listItemValue}>{formatCurrency(product.revenue)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function MetricCard({ title, value, change, icon }: any) {
  const isPositive = change >= 0
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={20} color="#175ead" />
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={styles.metricChange}>
        <Ionicons 
          name={isPositive ? "arrow-up" : "arrow-down"} 
          size={14} 
          color={isPositive ? "#10b981" : "#ef4444"} 
        />
        <Text style={[styles.metricChangeText, { color: isPositive ? "#10b981" : "#ef4444" }]}>
          {Math.abs(change).toFixed(1)}%
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
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
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  timeRangeTextActive: {
    color: 'white',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricChangeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  listItemRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#175ead',
    width: 24,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  listItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
})
