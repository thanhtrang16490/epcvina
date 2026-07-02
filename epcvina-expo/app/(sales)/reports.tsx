import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Modal, NativeScrollEvent, NativeSyntheticEvent, DimensionValue } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'

const filterTabs = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'yesterday', label: 'Hôm qua' },
  { id: 'this_month', label: 'Tháng này' },
  { id: 'all', label: 'Tất cả' },
  { id: 'other', label: 'Khác' },
]

const timeRangeOptions = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'yesterday', label: 'Hôm qua' },
  { id: 'last_7_days', label: '7 ngày qua' },
  { id: 'this_month', label: 'Tháng này' },
  { id: 'last_month', label: 'Tháng trước' },
  { id: 'last_3_months', label: '3 tháng gần đây' },
  { id: 'this_quarter', label: 'Quý này' },
  { id: 'this_year', label: 'Năm nay' },
  { id: 'all', label: 'Tất cả' },
]

type ReportData = {
  name: string
  revenue: number
  quantity: number
}

type TrendData = {
  label: string
  revenue: number
}

type CustomerData = {
  id: string
  name: string
  revenue: number
  orderCount: number
}

type SaleData = {
  id: string
  name: string
  revenue: number
  orderCount: number
}

type SaleAdminData = {
  id: string
  name: string
  revenue: number
  orderCount: number
}

// Memoized Report Item Component
const ReportItem = memo(({ item, maxRevenue, formatCurrency, roleTab }: any) => {
  const progressWidth = useMemo<DimensionValue>(() => {
    return `${(item.revenue / (maxRevenue || 1)) * 100}%` as DimensionValue
  }, [item.revenue, maxRevenue])

  const progressStyle = useMemo(() => {
    if (roleTab === 'customer') return styles.progressGreen
    if (roleTab === 'sale') return styles.progressPurple
    if (roleTab === 'saleadmin') return styles.progressBlue
    return {}
  }, [roleTab])

  return (
    <View style={styles.reportItem}>
      <View style={styles.reportItemLeft}>
        <Text style={styles.reportItemName}>{item.name}</Text>
        <View style={styles.reportItemMeta}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progress,
                progressStyle,
                { width: progressWidth }
              ]}
            />
          </View>
          <Text style={styles.reportItemQuantity}>
            {item.quantity ? `${item.quantity} units` : `${item.orderCount} đơn`}
          </Text>
        </View>
      </View>
      <Text style={styles.reportItemRevenue}>{formatCurrency(item.revenue)}</Text>
    </View>
  )
})

// Memoized Chart Bar Component
const ChartBar = memo(({ trend, maxRevenue }: any) => {
  const height = useMemo<DimensionValue>(() => {
    return `${(trend.revenue / maxRevenue) * 100}%` as DimensionValue
  }, [trend.revenue, maxRevenue])

  return (
    <View style={styles.chartBar}>
      <View style={[styles.bar, { height }]} />
      <Text style={styles.chartLabel}>{trend.label}</Text>
    </View>
  )
})

export default function ReportsScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { contentPaddingBottom: tabBarContentPadding } = useTabBarHeight()
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<number | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [period, setPeriod] = useState('this_month')
  const [showTimeRangeDrawer, setShowTimeRangeDrawer] = useState(false)
  const [activeTab, setActiveTab] = useState<'product' | 'category'>('product')
  const [roleTab, setRoleTab] = useState<'customer' | 'sale' | 'saleadmin'>('customer')
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    byProduct: [] as ReportData[],
    byCategory: [] as ReportData[],
    byCustomer: [] as CustomerData[],
    bySale: [] as SaleData[],
    bySaleAdmin: [] as SaleAdminData[],
    trend: [] as TrendData[],
  })

  useEffect(() => {
    fetchData()
  }, [period])

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
        router.replace('/(auth)/login')
        return
      }

      setProfile(profileData)

      // Fetch analytics
      const data = await getAnalytics(period, authUser.id, profileData.role)
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const getAnalytics = async (period: string, userId: string, role: string) => {
    const isAdmin = role === 'admin'
    const isSale = role === 'sale'
    const isSaleAdmin = role === 'sale_admin'

    let managedSaleIds: string[] = []
    if (isSaleAdmin) {
      const { data: managedSales } = await supabase
        .from('profiles')
        .select('id')
        .eq('manager_id', userId)
      managedSaleIds = managedSales?.map(s => s.id) || []
    }

    let query = supabase
      .from('orders')
      .select(`
        id,
        created_at,
        customer_id,
        sale_id,
        status,
        order_items (
          quantity,
          price_at_order,
          products ( 
            name, 
            category_id,
            categories ( name )
          )
        )
      `)
      .neq('status', 'cancelled')

    if (isSale) {
      query = query.eq('sale_id', userId)
    } else if (isSaleAdmin) {
      query = query.in('sale_id', [userId, ...managedSaleIds])
    }

    // Apply date filter
    const now = new Date()
    if (period === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
      query = query.gte('created_at', startOfDay).lt('created_at', endOfDay)
    } else if (period === 'yesterday') {
      const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString()
      const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      query = query.gte('created_at', startOfYesterday).lt('created_at', endOfYesterday)
    } else if (period === 'last_7_days') {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      query = query.gte('created_at', date.toISOString())
    } else if (period === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      query = query.gte('created_at', startOfMonth)
    } else if (period === 'last_month') {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      query = query.gte('created_at', startOfLastMonth).lt('created_at', endOfLastMonth)
    } else if (period === 'last_3_months') {
      const date = new Date()
      date.setMonth(date.getMonth() - 2)
      const startOfPeriod = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
      query = query.gte('created_at', startOfPeriod)
    } else if (period === 'this_quarter') {
      const quarter = Math.floor(now.getMonth() / 3)
      const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1).toISOString()
      query = query.gte('created_at', startOfQuarter)
    } else if (period === 'this_year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString()
      query = query.gte('created_at', startOfYear)
    }
    // 'all' period - no date filter

    const { data: orders, error } = await query

    // Debug logging
    console.log('Reports Query:', {
      period,
      role,
      userId,
      ordersCount: orders?.length || 0,
      error: error?.message
    })

    // Aggregate data
    const byProduct: Record<string, ReportData> = {}
    const byCategory: Record<string, ReportData> = {}
    const byCustomer: Record<string, CustomerData> = {}
    const bySale: Record<string, SaleData> = {}
    const bySaleAdmin: Record<string, SaleAdminData> = {}
    const trendMap: Record<string, number> = {}
    let totalRevenue = 0

    if (orders && orders.length > 0) {
      console.log('Sample order:', orders[0])
      // Fetch all profiles for customers and sales
      const customerIds = [...new Set(orders.map((o: any) => o.customer_id).filter(Boolean))]
      const saleIds = [...new Set(orders.map((o: any) => o.sale_id).filter(Boolean))]
      const allProfileIds = [...new Set([...customerIds, ...saleIds])]

      let profilesMap: any = {}
      if (allProfileIds.length > 0 && isAdmin) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .in('id', allProfileIds)
        
        profiles?.forEach((p: any) => {
          profilesMap[p.id] = p
        })
      }

      for (const order of orders) {
        const date = new Date(order.created_at)
        const monthLabel = date.toLocaleString('default', { month: 'short' })

        let orderTotal = 0
        const items = order.order_items as any[]
        
        for (const item of items) {
          const productName = item.products?.name || 'Unknown'
          const categoryName = item.products?.categories?.name || 'Uncategorized'
          const revenue = (item.price_at_order || 0) * (item.quantity || 0)

          orderTotal += revenue
          totalRevenue += revenue

          // Product Aggregation
          if (!byProduct[productName]) {
            byProduct[productName] = { name: productName, revenue: 0, quantity: 0 }
          }
          byProduct[productName].revenue += revenue
          byProduct[productName].quantity += item.quantity

          // Category Aggregation
          if (!byCategory[categoryName]) {
            byCategory[categoryName] = { name: categoryName, revenue: 0, quantity: 0 }
          }
          byCategory[categoryName].revenue += revenue
          byCategory[categoryName].quantity += item.quantity
        }

        // Customer Aggregation (for admin only)
        if (isAdmin && order.customer_id) {
          if (!byCustomer[order.customer_id]) {
            byCustomer[order.customer_id] = {
              id: order.customer_id,
              name: profilesMap[order.customer_id]?.full_name || 'Unknown',
              revenue: 0,
              orderCount: 0
            }
          }
          byCustomer[order.customer_id].revenue += orderTotal
          byCustomer[order.customer_id].orderCount += 1
        }

        // Sale Aggregation (for admin only)
        if (isAdmin && order.sale_id) {
          const saleRole = profilesMap[order.sale_id]?.role
          
          // Aggregate by Sale (only role='sale')
          if (saleRole === 'sale') {
            if (!bySale[order.sale_id]) {
              bySale[order.sale_id] = {
                id: order.sale_id,
                name: profilesMap[order.sale_id]?.full_name || 'Unknown',
                revenue: 0,
                orderCount: 0
              }
            }
            bySale[order.sale_id].revenue += orderTotal
            bySale[order.sale_id].orderCount += 1
          }
          
          // Aggregate by Sale Admin (only role='sale_admin')
          if (saleRole === 'sale_admin') {
            if (!bySaleAdmin[order.sale_id]) {
              bySaleAdmin[order.sale_id] = {
                id: order.sale_id,
                name: profilesMap[order.sale_id]?.full_name || 'Unknown',
                revenue: 0,
                orderCount: 0
              }
            }
            bySaleAdmin[order.sale_id].revenue += orderTotal
            bySaleAdmin[order.sale_id].orderCount += 1
          }
        }

        // Trend
        trendMap[monthLabel] = (trendMap[monthLabel] || 0) + orderTotal
      }
    }

    return {
      totalRevenue,
      byProduct: Object.values(byProduct).sort((a, b) => b.revenue - a.revenue),
      byCategory: Object.values(byCategory).sort((a, b) => b.revenue - a.revenue),
      byCustomer: Object.values(byCustomer).sort((a, b) => b.revenue - a.revenue),
      bySale: Object.values(bySale).sort((a, b) => b.revenue - a.revenue),
      bySaleAdmin: Object.values(bySaleAdmin).sort((a, b) => b.revenue - a.revenue),
      trend: Object.entries(trendMap).map(([label, revenue]) => ({ label, revenue })),
    }
  }

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [])

  const handleFilterChange = useCallback((filterId: string) => {
    if (filterId === 'other') {
      setShowTimeRangeDrawer(true)
    } else {
      setPeriod(filterId)
    }
  }, [])

  const handleTimeRangeSelect = useCallback((rangeId: string) => {
    setPeriod(rangeId)
    setShowTimeRangeDrawer(false)
  }, [])

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
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

  // Memoized calculations - MUST be before any early returns
  const isAdmin = profile?.role === 'admin'
  const isSaleAdmin = profile?.role === 'sale_admin'
  const { totalRevenue, byProduct, byCategory, byCustomer, bySale, bySaleAdmin, trend } = analytics
  
  const maxRevenue = useMemo(() => Math.max(...trend.map(t => t.revenue), 1), [trend])
  
  const displayData = useMemo(() => {
    return activeTab === 'product' ? byProduct.slice(0, 5) : byCategory.slice(0, 5)
  }, [activeTab, byProduct, byCategory])
  
  const roleData = useMemo(() => {
    if (roleTab === 'customer') return byCustomer.slice(0, 5)
    if (roleTab === 'sale') return bySale.slice(0, 5)
    return bySaleAdmin.slice(0, 5)
  }, [roleTab, byCustomer, bySale, bySaleAdmin])

  const maxDisplayRevenue = useMemo(() => {
    return displayData[0]?.revenue || 1
  }, [displayData])

  const maxRoleRevenue = useMemo(() => {
    return roleData[0]?.revenue || 1
  }, [roleData])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Logo */}
      <AppHeader />

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Báo cáo & Phân tích</Text>
          <Text style={styles.subtitle}>
            {isAdmin ? 'Toàn hệ thống' : isSaleAdmin ? 'Nhóm của bạn' : 'Của bạn'}
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="bar-chart" size={24} color="#175ead" />
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filterTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.filterTab,
              period === tab.id && styles.filterTabActive
            ]}
            onPress={() => handleFilterChange(tab.id)}
          >
            <Text style={[
              styles.filterTabText,
              period === tab.id && styles.filterTabTextActive
            ]}>
              {tab.label}
            </Text>
            {tab.id === 'other' && (
              <Ionicons 
                name="chevron-down" 
                size={16} 
                color={period === tab.id ? 'white' : '#666'} 
                style={{ marginLeft: 4 }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarContentPadding }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Total Revenue Card */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Text style={styles.revenueLabel}>TỔNG DOANH THU</Text>
            <Ionicons name="wallet" size={32} color="rgba(255,255,255,0.3)" />
          </View>
          <Text style={styles.revenueAmount}>{formatCurrency(totalRevenue)}</Text>
          <View style={styles.revenueMeta}>
            <Ionicons name="trending-up" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.revenueMetaText}>Dựa trên khoảng thời gian đã chọn</Text>
          </View>
        </View>

        {/* Trend Chart */}
        <View style={styles.trendCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="trending-up" size={16} color="#10b981" />
            <Text style={styles.cardTitle}>Xu hướng doanh thu</Text>
          </View>
          <View style={styles.chartContainer}>
            {trend.length > 0 ? (
              trend.map((t, i) => (
                <ChartBar key={i} trend={t} maxRevenue={maxRevenue} />
              ))
            ) : (
              <Text style={styles.emptyChartText}>Chưa có đủ dữ liệu</Text>
            )}
          </View>
        </View>

        {/* Product/Category Tabs */}
        <View style={styles.tabsCard}>
          <View style={styles.tabsHeader}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'product' && styles.tabActive]}
              onPress={() => setActiveTab('product')}
            >
              <Text style={[styles.tabText, activeTab === 'product' && styles.tabTextActive]}>
                SẢN PHẨM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'category' && styles.tabActive]}
              onPress={() => setActiveTab('category')}
            >
              <Text style={[styles.tabText, activeTab === 'category' && styles.tabTextActive]}>
                DANH MỤC
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>
            {displayData.length > 0 ? (
              displayData.map((item, idx) => (
                <ReportItem 
                  key={idx} 
                  item={item} 
                  maxRevenue={maxDisplayRevenue}
                  formatCurrency={formatCurrency}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={32} color="#d1d5db" />
                <Text style={styles.emptyText}>Không có dữ liệu</Text>
              </View>
            )}
          </View>
        </View>

        {/* Admin Only: Role-based Reports */}
        {isAdmin && (
          <View style={styles.tabsCard}>
            <View style={styles.roleTabsHeader}>
              <TouchableOpacity
                style={[styles.roleTab, roleTab === 'customer' && styles.roleTabActiveGreen]}
                onPress={() => setRoleTab('customer')}
              >
                <Text style={[styles.roleTabText, roleTab === 'customer' && styles.roleTabTextActive]}>
                  KHÁCH HÀNG
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleTab, roleTab === 'sale' && styles.roleTabActivePurple]}
                onPress={() => setRoleTab('sale')}
              >
                <Text style={[styles.roleTabText, roleTab === 'sale' && styles.roleTabTextActive]}>
                  SALE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleTab, roleTab === 'saleadmin' && styles.roleTabActiveBlue]}
                onPress={() => setRoleTab('saleadmin')}
              >
                <Text style={[styles.roleTabText, roleTab === 'saleadmin' && styles.roleTabTextActive]}>
                  SALE ADMIN
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabContent}>
              {roleData.length > 0 ? (
                roleData.map((item: any, idx) => (
                  <ReportItem 
                    key={idx} 
                    item={item} 
                    maxRevenue={maxRoleRevenue}
                    formatCurrency={formatCurrency}
                    roleTab={roleTab}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={32} color="#d1d5db" />
                  <Text style={styles.emptyText}>Không có dữ liệu</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Time Range Bottom Drawer */}
      <Modal
        visible={showTimeRangeDrawer}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeRangeDrawer(false)}
      >
        <TouchableOpacity 
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={() => setShowTimeRangeDrawer(false)}
        >
          <View style={styles.drawerContent} onStartShouldSetResponder={() => true}>
            <View style={styles.drawerHandle} />
            
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Chọn thời gian</Text>
              <TouchableOpacity 
                style={styles.drawerCloseButton}
                onPress={() => setShowTimeRangeDrawer(false)}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.drawerScroll}>
              {timeRangeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.drawerOption,
                    period === option.id && styles.drawerOptionActive
                  ]}
                  onPress={() => handleTimeRangeSelect(option.id)}
                >
                  <Text style={[
                    styles.drawerOptionText,
                    period === option.id && styles.drawerOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                  {period === option.id && (
                    <Ionicons name="checkmark" size={24} color="#175ead" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  pageHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
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
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f0f9ff',
    maxHeight: 44,
  },
  filterContent: {
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  revenueCard: {
    backgroundColor: '#175ead',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  revenueLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1,
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  revenueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  revenueMetaText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  trendCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chartContainer: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    paddingHorizontal: 4,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: '100%',
    backgroundColor: 'rgba(23, 94, 173, 0.2)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  emptyChartText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  tabsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabsHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#175ead',
  },
  tabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: 'white',
  },
  tabContent: {
    padding: 16,
    gap: 16,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportItemLeft: {
    flex: 1,
    gap: 4,
  },
  reportItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  reportItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 96,
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: 'rgba(23, 94, 173, 0.6)',
  },
  reportItemQuantity: {
    fontSize: 11,
    color: '#6b7280',
  },
  reportItemRevenue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  roleTabsHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 4,
    gap: 4,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  roleTabActiveGreen: {
    backgroundColor: '#10b981',
  },
  roleTabActivePurple: {
    backgroundColor: '#a855f7',
  },
  roleTabActiveBlue: {
    backgroundColor: '#175ead',
  },
  roleTabText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  roleTabTextActive: {
    color: 'white',
  },
  progressGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.6)',
  },
  progressPurple: {
    backgroundColor: 'rgba(168, 85, 247, 0.6)',
  },
  progressBlue: {
    backgroundColor: 'rgba(23, 94, 173, 0.6)',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawerContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  drawerCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerScroll: {
    maxHeight: 500,
  },
  drawerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  drawerOptionActive: {
    backgroundColor: '#f0f9ff',
  },
  drawerOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  drawerOptionTextActive: {
    color: '#175ead',
    fontWeight: '600',
  },
})
