import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Image, TextInput } from 'react-native'
import { OrdersListSkeleton } from '../../../src/components/SkeletonLoader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import SuccessModal from '../../../src/components/SuccessModal'
import { emitScrollVisibility } from '../_layout'
import { useTabBarHeight } from '../../../src/hooks/useTabBarHeight'
import { hasTeamFeatures } from '../../../src/lib/feature-flags'
import { useOrdersList, useUpdateOrderStatus } from '../../../src/hooks/useOrdersQuery'

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

const scopeTabs = [
  { id: 'my', label: 'Của tôi' },
  { id: 'team', label: 'Team' },
]

export default function OrdersScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('draft')
  const [scopeTab, setScopeTab] = useState<'my' | 'team'>('my')
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── React Query ────────────────────────────────────────────────────────────
  const {
    data: orders = [],
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useOrdersList({
    userId: user?.id ?? '',
    role: profile?.role ?? '',
    scope: scopeTab,
    teamMemberIds,
    enabled: !!user && !!profile,
  })

  // Kết hợp loading: profile đang tải HOẶC orders đang tải
  const loading = profileLoading || ordersLoading

  const updateStatusMutation = useUpdateOrderStatus(user?.id ?? '', scopeTab)

  // Refetch khi scopeTab thay đổi
  useEffect(() => {
    if (profile) refetchOrders()
  }, [scopeTab])

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

  // Fetch profile and team members
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfileLoading(false)
        return
      }
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setProfile(data)
        
        // If sale_admin, fetch team member IDs
        if (data?.role === 'sale_admin') {
          const { data: teamData } = await supabase
            .from('sales_teams')
            .select('id')
            .eq('manager_id', user.id)
            .single()
          
          if (teamData) {
            const { data: membersData } = await supabase
              .from('team_members')
              .select('sale_id')
              .eq('team_id', teamData.id)
              .eq('status', 'active')
            
            setTeamMemberIds(membersData?.map(m => m.sale_id) || [])
          }
        }
      } finally {
        setProfileLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  // Auto refresh khi screen được focus
  useFocusEffect(
    useCallback(() => {
      if (profile) refetchOrders()
    }, [profile, refetchOrders])
  )


  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      // Optimistic update - UI cập nhật ngay lập tức
      await updateStatusMutation.mutateAsync({ orderId, newStatus })
      const statusLabel = statusMap[newStatus]?.label || newStatus
      setSuccessMessage(`Đã cập nhật trạng thái: ${statusLabel}`)
      setShowSuccessModal(true)
    } catch (error) {
      // Rollback đã được xử lý trong useUpdateOrderStatus.onError
    }
  }


  const onRefresh = async () => {
    setRefreshing(true)
    await refetchOrders()
    setRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }

  const getFilteredOrders = () => {
    const byStatus = orders.filter(order => order.status === activeTab)
    if (!searchQuery.trim()) return byStatus

    const q = searchQuery.toLowerCase().trim()
    return byStatus.filter(order => {
      const idMatch = String(order.id).includes(q)
      const customerName = (order.customer?.name || '').toLowerCase()
      const customerPhone = (order.customer?.phone || '').toLowerCase()
      return idMatch || customerName.includes(q) || customerPhone.includes(q)
    })
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <OrdersListSkeleton />
      </View>
    )
  }

  const isSaleAdmin = profile?.role === 'sale_admin'
  const filteredOrders = getFilteredOrders()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Logo */}
      <View style={styles.topHeader}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoTitle}>APPE JV</Text>
        </View>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => router.push('/(sales)/menu')}
        >
          <Ionicons name="menu" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Page Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              {isSaleAdmin ? 'Đơn hàng nhóm' : 'Đơn hàng của tôi'}
            </Text>
            <Text style={styles.headerSubtitle}>Quản lý và theo dõi tiến độ đơn hàng</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(sales)/selling')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo mã đơn, tên, SĐT khách..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClear}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => {
            const count = orders.filter(o => o.status === tab.id).length
            return (
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
                  {count > 0 ? ` (${count})` : ''}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Scope Tabs (My/Team) */}
      {profile && hasTeamFeatures(profile.role) && (
        <View style={styles.scopeTabsContainer}>
          {scopeTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.scopeTab,
                scopeTab === tab.id && styles.scopeTabActive
              ]}
              onPress={() => setScopeTab(tab.id as 'my' | 'team')}
            >
              <Text style={[
                styles.scopeTabText,
                scopeTab === tab.id && styles.scopeTabTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Orders List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: contentPaddingBottom }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name={searchQuery ? 'search-outline' : 'bag-handle-outline'} size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>
              {searchQuery ? `Không tìm thấy "${searchQuery}"` : 'Không có đơn hàng nào'}
            </Text>
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <Text style={styles.clearSearchText}>Xóa tìm kiếm</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          filteredOrders.map((order) => {
            const config = statusMap[order.status] || statusMap.draft
            const nextStatus = getNextStatus(order.status)
            
            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Info */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderLeft}>
                    <View style={styles.orderIcon}>
                      <Ionicons name="bag-handle" size={20} color="#175ead" />
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
                      {order.customer && (
                        <Text style={styles.customerName}>{order.customer.name}</Text>
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
                    onPress={() => router.push(`/(sales)/orders/${order.id}`)}
                  >
                    <Text style={styles.actionButtonOutlineText}>Chi tiết</Text>
                  </TouchableOpacity>
                  
                  
                  {nextStatus && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: nextStatus.color },
                        updateStatusMutation.isPending && styles.actionButtonDisabled
                      ]}
                      onPress={() => handleUpdateStatus(order.id, nextStatus.status)}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending && updateStatusMutation.variables?.orderId === order.id ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={styles.actionButtonText}>{nextStatus.label}</Text>
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
        title="Cập nhật thành công!"
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    height: 44,
  },
  searchClear: {
    padding: 4,
  },
  clearSearchBtn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  clearSearchText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
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
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#175ead',
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
    backgroundColor: '#175ead',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: 'white',
  },
  scopeTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f9ff',
    gap: 8,
  },
  scopeTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  scopeTabActive: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  scopeTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  scopeTabTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    // paddingBottom is set dynamically using useTabBarHeight hook
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
    backgroundColor: '#f0f9ff',
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
  customerName: {
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
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonOutline: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  actionButtonOutlineText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
})
