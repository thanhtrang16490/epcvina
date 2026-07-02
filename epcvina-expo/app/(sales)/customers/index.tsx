import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useDebounce } from '../../../src/hooks/useDebounce'
import { emitScrollVisibility } from '../_layout'
import { useTabBarHeight } from '../../../src/hooks/useTabBarHeight'
import AppHeader from '../../../src/components/AppHeader'
import { hasTeamFeatures } from '../../../src/lib/feature-flags'

// Generate consistent color based on name
const getAvatarColor = (name: string) => {
  const colors = [
    { bg: '#3b82f6', text: '#ffffff' }, // blue
    { bg: '#10b981', text: '#ffffff' }, // emerald
    { bg: '#a855f7', text: '#ffffff' }, // purple
    { bg: '#f59e0b', text: '#ffffff' }, // amber
    { bg: '#f43f5e', text: '#ffffff' }, // rose
    { bg: '#06b6d4', text: '#ffffff' }, // cyan
    { bg: '#6366f1', text: '#ffffff' }, // indigo
    { bg: '#ec4899', text: '#ffffff' }, // pink
    { bg: '#14b8a6', text: '#ffffff' }, // teal
    { bg: '#f97316', text: '#ffffff' }, // orange
  ]
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// Memoized CustomerCard component
const CustomerCard = memo(({ 
  customer, 
  onPress 
}: { 
  customer: any
  onPress: () => void
}) => {
  const avatarColor = getAvatarColor(customer.name || 'Unknown')
  const initials = (customer.name || 'UK').substring(0, 2).toUpperCase()
  
  return (
    <TouchableOpacity
      style={styles.customerCard}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.customerContent}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
          <Text style={[styles.avatarText, { color: avatarColor.text }]}>
            {initials}
          </Text>
        </View>

        {/* Customer Info */}
        <View style={styles.customerDetails}>
          <View style={styles.customerHeader}>
            <Text style={styles.customerName} numberOfLines={1}>
              {customer.name}
            </Text>
            {customer.code && (
              <Text style={styles.customerCode}>{customer.code}</Text>
            )}
          </View>

          <View style={styles.customerMeta}>
            {customer.phone && (
              <View style={styles.metaItem}>
                <Ionicons name="call" size={12} color="#6b7280" />
                <Text style={styles.metaText}>{customer.phone}</Text>
              </View>
            )}
            {customer.address && (
              <View style={styles.metaItem}>
                <Ionicons name="location" size={12} color="#6b7280" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {customer.address}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
      </View>
    </TouchableOpacity>
  )
})

export default function CustomersScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'my' | 'team' | 'all'>('my')
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([])
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    fetchData()
  }, [activeTab])

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

  // Memoized filtered customers
  const filteredCustomers = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return customers
    }
    
    const query = debouncedSearchQuery.toLowerCase()
    return customers.filter(customer =>
      customer.name?.toLowerCase().includes(query) ||
      customer.code?.toLowerCase().includes(query) ||
      customer.phone?.includes(debouncedSearchQuery) ||
      customer.address?.toLowerCase().includes(query)
    )
  }, [debouncedSearchQuery, customers])

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

      // Fetch customers from customers table
      let query = supabase
        .from('customers')
        .select('*, assigned_sale:profiles!customers_assigned_to_fkey(full_name, role)')
        .order('full_name', { ascending: true, nullsFirst: false })

      // Filter based on active tab
      if (activeTab === 'my') {
        // For 'my' tab, show customers assigned to current user
        query = query.eq('assigned_to', authUser.id)
      } else if (activeTab === 'team' && teamMemberIds.length > 0) {
        // For 'team' tab, filter by team member IDs
        query = query.in('assigned_to', teamMemberIds)
      }
      // 'all' tab: no filter (admin sees everything)

      const { data: customersData, error: customersError } = await query

      if (customersError) {
        console.error('Error fetching customers:', customersError)
      }

      console.log('Customers loaded:', customersData?.length)
      console.log('Sample customer:', customersData?.[0])

      // Map profiles to customer format
      const mappedCustomers = (customersData || []).map(p => ({
        id: p.id,
        name: p.full_name || 'No Name',
        code: p.id.substring(0, 8), // Use first 8 chars of ID as code
        phone: p.phone || '',
        address: p.address || '',
        email: p.email || '',
        created_at: p.created_at,
      }))

      setCustomers(mappedCustomers)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [])

  const handleCustomerPress = useCallback((customerId: string) => {
    router.push(`/(sales)/customers/${customerId}`)
  }, [router])

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

  const renderCustomerItem = useCallback(({ item }: { item: any }) => (
    <CustomerCard
      customer={item}
      onPress={() => handleCustomerPress(item.id)}
    />
  ), [handleCustomerPress])

  const keyExtractor = useCallback((item: any) => item.id, [])

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={48} color="#d1d5db" />
      <Text style={styles.emptyText}>
        {searchQuery ? 'Không tìm thấy khách hàng nào' : 'Chưa có khách hàng nào'}
      </Text>
      {searchQuery && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [searchQuery])

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
          <Text style={styles.title}>Khách hàng</Text>
          <Text style={styles.subtitle}>{filteredCustomers.length} khách hàng</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(sales)/customers/add')}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm khách hàng..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      {profile && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'my' && styles.tabActive]}
            onPress={() => setActiveTab('my')}
          >
            <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
              Của tôi
            </Text>
          </TouchableOpacity>
          
          {hasTeamFeatures(profile.role) && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'team' && styles.tabActive]}
              onPress={() => setActiveTab('team')}
            >
              <Text style={[styles.tabText, activeTab === 'team' && styles.tabTextActive]}>
                Team
              </Text>
            </TouchableOpacity>
          )}
          
          {profile.role === 'admin' && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'all' && styles.tabActive]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                Tất cả
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Customers List */}
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[styles.listContent, { paddingBottom: contentPaddingBottom }]}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
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
  addButton: {
    backgroundColor: '#175ead',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f0f9ff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f9ff',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabActive: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  clearButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  customerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  customerDetails: {
    flex: 1,
    minWidth: 0,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  customerCode: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerMeta: {
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
})
