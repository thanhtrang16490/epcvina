import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'

export default function CustomerAssignScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(true)
  const [unassignedCustomers, setUnassignedCustomers] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [assigning, setAssigning] = useState(false)

  // Calculate bottom padding for tab bar (60px tab bar + bottom inset)
  const bottomPadding = 60 + insets.bottom

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      if (!user) return

      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      // Get current user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      const isAdmin = profileData?.role === 'admin'

      // Fetch customers from customers table (only unassigned ones)
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .is('assigned_to', null)
        .order('full_name', { ascending: true })
      
      setUnassignedCustomers(customersData || [])
      
      // Fetch team members
      let teamQuery = supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'sale')
        .order('full_name', { ascending: true })

      // If sale_admin, only show their team members
      if (!isAdmin) {
        teamQuery = teamQuery.eq('manager_id', user.id)
      }
      // If admin, show all sale users (no filter)

      const { data: teamData } = await teamQuery
      
      setTeamMembers(teamData || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCustomer = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleAssign = async () => {
    if (selectedCustomers.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn khách hàng')
      return
    }
    
    if (!selectedMember) {
      Alert.alert('Lỗi', 'Vui lòng chọn nhân viên')
      return
    }
    
    try {
      setAssigning(true)
      
      // Update customers table
      const { error } = await supabase
        .from('customers')
        .update({
          assigned_to: selectedMember,
        })
        .in('id', selectedCustomers)
      
      if (error) {
        console.error('Assignment error:', error)
        Alert.alert('Lỗi', 'Không thể gán khách hàng: ' + error.message)
      } else {
        Alert.alert('Thành công', `Đã gán ${selectedCustomers.length} khách hàng`)
        setSelectedCustomers([])
        setSelectedMember(null)
        fetchData()
      }
    } catch (error) {
      console.error('Error:', error)
      Alert.alert('Lỗi', 'Không thể gán khách hàng')
    } finally {
      setAssigning(false)
    }
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gán khách hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: bottomPadding + 80 }}
      >
        {/* Select Team Member */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn nhân viên</Text>
          {teamMembers.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có nhân viên trong team của bạn</Text>
          ) : (
            teamMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberCard,
                  selectedMember === member.id && styles.memberCardSelected
                ]}
                onPress={() => setSelectedMember(member.id)}
              >
                <Ionicons 
                  name={selectedMember === member.id ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color={selectedMember === member.id ? "#175ead" : "#9ca3af"}
                />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.full_name || 'Unknown'}</Text>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Select Customers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Chọn khách hàng ({selectedCustomers.length}/{unassignedCustomers.length})
          </Text>
          {unassignedCustomers.length === 0 ? (
            <Text style={styles.emptyText}>Không có khách hàng nào</Text>
          ) : (
            unassignedCustomers.map((customer) => (
              <TouchableOpacity
                key={customer.id}
                style={[
                  styles.customerCard,
                  selectedCustomers.includes(customer.id) && styles.customerCardSelected
                ]}
                onPress={() => toggleCustomer(customer.id)}
              >
                <Ionicons 
                  name={selectedCustomers.includes(customer.id) ? "checkbox" : "square-outline"}
                  size={24}
                  color={selectedCustomers.includes(customer.id) ? "#175ead" : "#9ca3af"}
                />
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{customer.full_name || 'No Name'}</Text>
                  <Text style={styles.customerPhone}>{customer.phone || 'No phone'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Assign Button */}
      <View style={[styles.footer, { paddingBottom: bottomPadding }]}>
        <TouchableOpacity
          style={[styles.assignButton, assigning && styles.assignButtonDisabled]}
          onPress={handleAssign}
          disabled={assigning}
        >
          {assigning ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.assignButtonText}>
              Gán {selectedCustomers.length} khách hàng
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 32,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  memberCardSelected: {
    borderColor: '#175ead',
    backgroundColor: '#f0f9ff',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  memberInfo: {
    flex: 1,
  },
  memberEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  customerCardSelected: {
    borderColor: '#175ead',
    backgroundColor: '#f0f9ff',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  assignButton: {
    backgroundColor: '#175ead',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  assignButtonDisabled: {
    opacity: 0.6,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
