import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import SuccessModal from '../../../src/components/SuccessModal'
import AppHeader from '../../../src/components/AppHeader'
import { hasTeamFeatures } from '../../../src/lib/feature-flags'
import { useTabBarHeight } from '../../../src/hooks/useTabBarHeight'

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
  const [orders, setOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('draft')
  const [scopeTab, setScopeTab] = useState<'my' | 'team'>('my')
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updating, setUpdating] = useState<number | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')



  useEffect(() => {
    fetchData()
  }, [scopeTab])

  // Fetch profile and team members
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
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
      }
    }
    fetchProfile()
  }, [user])

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
        .select('role, full_name')
        .eq('id', authUser.id)
        .single()

      if (!profileData || !['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
        router.replace('/(auth)/login')
        return
      }

      setProfile(profileData)

      // Fetch orders
      await fetchOrders(authUser.id, profileData.role)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchOrders = async (userId: string, role: string) => {
    try {
      const isSale = role === 'sale'
      const isSaleAdmin = role === 'sale_admin'

      // Build query - fetch orders only
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      // Filter based on scope tab
      if (scopeTab === 'my') {
        query = query.eq('sale_id', userId)
      } else if (scopeTab === 'team' && teamMemberIds.length > 0) {
        query = query.in('sale_id', teamMemberIds)
      }

      const { data, error } = await query

      if (error) throw error

      // Fetch customer and sale info from profiles
      if (data && data.length > 0) {
        const customerIds = [...new Set(data.map((o: any) => o.customer_id).filter(Boolean))]
        const saleIds = [...new Set(data.map((o: any) => o.sale_id).filter(Boolean))]
        const allProfileIds = [...new Set([...customerIds, ...saleIds])]

        // Fetch all profiles at once
        let profilesMap: any = {}
        if (allProfileIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, phone, role')
            .in('id', allProfileIds)
          
          profiles?.forEach((p: any) => {
            profilesMap[p.id] = p
          })
        }

        // Merge data
        const ordersWithRelations = data.map((order: any) => ({
          ...order,
          customer: order.customer_id ? {
            name: profilesMap[order.customer_id]?.full_name,
            phone: profilesMap[order.customer_id]?.phone,
          } : null,
          sale: order.sale_id ? {
            full_name: profilesMap[order.sale_id]?.full_name,
          } : null,
        }))

        setOrders(ordersWithRelations)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    }
  }

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdating(orderId)
      
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      // Show success message
      const statusLabel = statusMap[newStatus]?.label || newStatus
      setSuccessMessage(`Đã cập nhật trạng thái: ${statusLabel}`)
      setShowSuccessModal(true)

      // Refresh orders
      if (user && profile) {
        await fetchOrders(user.id, profile.role)
      }
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setUpdating(null)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }

  const getFilteredOrders = () => {
    return orders.filter(order => order.status === activeTab)
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
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  const isSaleAdmin = profile?.role === 'sale_admin'
  const filteredOrders = getFilteredOrders()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />
      
      {/* Page Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              {isSaleAdmin ? 'Đơn hàng nhóm' : 'Đơn hàng của tôi'}
            </Text>
            <Text style={styles.headerSubtitle}>Quản lý và theo dõi tiến độ đơn hàng</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="bag-handle" size={24} color="#175ead" />
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterTab,
                activeTab === tab.id && styles.filterTabActive
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.filterTabText,
                activeTab === tab.id && styles.filterTabTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.content, { paddingBottom: contentPaddingBottom }]}>
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

          {/* Add Button */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(sales)/selling')}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>Tạo đơn hàng mới</Text>
          </TouchableOpacity>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bag-handle-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
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
                      onPress={() => router.push(`/(sales-pages)/orders/${order.id}`)}
                    >
                      <Text style={styles.actionButtonOutlineText}>Chi tiết</Text>
                    </TouchableOpacity>
                    
                    {nextStatus && (
                      <TouchableOpacity 
                        style={[
                          styles.actionButton,
                          { backgroundColor: nextStatus.color },
                          updating === order.id && styles.actionButtonDisabled
                        ]}
                        onPress={() => handleUpdateStatus(order.id, nextStatus.status)}
                        disabled={updating === order.id}
                      >
                        {updating === order.id ? (
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
        </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
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
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    marginTop: 8,
  },
  filterContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  content: {
    padding: 16,
    gap: 12,
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
  scopeTabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#175ead',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
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
