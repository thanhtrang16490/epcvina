import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Image, RefreshControl, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { hasTeamFeatures } from '../../../src/lib/feature-flags'
import AppHeader from '../../../src/components/AppHeader'

export default function TeamManagementScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [team, setTeam] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

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
        .select('*')
        .eq('id', authUser.id)
        .single()

      setProfile(profileData)

      // Check if user has team features
      if (!hasTeamFeatures(profileData?.role)) {
        Alert.alert('Lỗi', 'Bạn không có quyền truy cập trang này')
        router.replace('/(sales)/dashboard')
        return
      }

      // Fetch team where user is manager
      const { data: teamData } = await supabase
        .from('sales_teams')
        .select('*')
        .eq('manager_id', authUser.id)
        .eq('status', 'active')
        .single()

      setTeam(teamData)

      if (teamData) {
        // Fetch team members
        const { data: membersData } = await supabase
          .from('team_members')
          .select(`
            *,
            sale:profiles!team_members_sale_id_fkey(*)
          `)
          .eq('team_id', teamData.id)
          .eq('status', 'active')

        // Fetch stats for each member
        const membersWithStats = await Promise.all(
          (membersData || []).map(async (member) => {
            // Count customers
            const { count: customersCount } = await supabase
              .from('customers')
              .select('*', { count: 'exact', head: true })
              .eq('assigned_to', member.sale_id)

            // Count orders
            const { count: ordersCount } = await supabase
              .from('orders')
              .select('*', { count: 'exact', head: true })
              .eq('created_by', member.sale_id)

            // Calculate revenue
            const { data: revenueData } = await supabase
              .from('orders')
              .select('total')
              .eq('created_by', member.sale_id)
              .eq('status', 'completed')

            const revenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

            return {
              ...member,
              customersCount: customersCount || 0,
              ordersCount: ordersCount || 0,
              revenue,
            }
          })
        )

        setTeamMembers(membersWithStats)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      Alert.alert('Lỗi', 'Không thể tải dữ liệu team')
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

  if (!team) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header with Logo */}
        <AppHeader />

        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Chưa có team</Text>
          <Text style={styles.emptyText}>
            Bạn chưa được gán quản lý team nào.{'\n'}
            Liên hệ admin để được thêm vào team.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const totalCustomers = teamMembers.reduce((sum, m) => sum + m.customersCount, 0)
  const totalOrders = teamMembers.reduce((sum, m) => sum + m.ordersCount, 0)
  const totalRevenue = teamMembers.reduce((sum, m) => sum + m.revenue, 0)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Logo */}
      <AppHeader />

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>Team của tôi</Text>
          <Text style={styles.subtitle}>{team.name}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Team Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Tổng quan team</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={24} color="#175ead" />
              <Text style={styles.statValue}>{teamMembers.length}</Text>
              <Text style={styles.statLabel}>Thành viên</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="person" size={24} color="#10b981" />
              <Text style={styles.statValue}>{totalCustomers}</Text>
              <Text style={styles.statLabel}>Khách hàng</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="receipt" size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{totalOrders}</Text>
              <Text style={styles.statLabel}>Đơn hàng</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cash" size={24} color="#10b981" />
              <Text style={styles.statValue}>
                {new Intl.NumberFormat('vi-VN', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(totalRevenue)}
              </Text>
              <Text style={styles.statLabel}>Doanh thu</Text>
            </View>
          </View>
        </View>

        {/* Team Members */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành viên ({teamMembers.length})</Text>
          
          {teamMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="person-add-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>Chưa có thành viên nào trong team</Text>
            </View>
          ) : (
            teamMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={styles.memberCard}
                onPress={() => router.push(`/(sales-pages)/team/${member.sale_id}` as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.memberCardTop, { backgroundColor: 'rgba(23, 94, 173, 0.1)' }]} />
                
                <View style={styles.memberCardHeader}>
                  <View style={styles.memberIcon}>
                    <Ionicons name="person" size={24} color="#175ead" />
                  </View>
                  <View style={styles.memberBadge}>
                    <Text style={styles.memberBadgeText}>SALE</Text>
                  </View>
                </View>

                <View style={styles.memberCardBody}>
                  <Text style={styles.memberName}>{member.sale?.full_name || 'No Name'}</Text>
                  <Text style={styles.memberPhone}>{member.sale?.phone || '---'}</Text>

                  <View style={styles.memberStats}>
                    <View style={styles.memberStatRow}>
                      <Text style={styles.memberStatLabel}>Khách hàng:</Text>
                      <Text style={styles.memberStatValue}>{member.customersCount}</Text>
                    </View>
                    <View style={styles.memberStatRow}>
                      <Text style={styles.memberStatLabel}>Đơn hàng:</Text>
                      <Text style={styles.memberStatValue}>{member.ordersCount}</Text>
                    </View>
                    <View style={styles.memberStatRow}>
                      <Text style={styles.memberStatLabel}>Doanh thu:</Text>
                      <Text style={[styles.memberStatValue, { color: '#10b981' }]}>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(member.revenue)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.memberFooter}>
                    <Text style={styles.memberJoinDate}>
                      Tham gia: {new Date(member.joined_at).toLocaleDateString('vi-VN')}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </View>
                </View>
              </TouchableOpacity>
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
  pageHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
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
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
  memberCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  memberCardTop: {
    height: 8,
  },
  memberCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  memberIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  memberBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#175ead',
  },
  memberCardBody: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  memberPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  memberStats: {
    gap: 8,
  },
  memberStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberStatLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  memberStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  memberFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  memberJoinDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
})
