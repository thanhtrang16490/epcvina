import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Image, RefreshControl, Alert, Modal, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return { label: 'Admin', color: '#ef4444', bg: '#fee2e2' }
    case 'sale_admin':
      return { label: 'Sale Admin', color: '#f59e0b', bg: '#fef3c7' }
    case 'sale':
      return { label: 'Sale', color: '#6366f1', bg: '#e0e7ff' }
    default:
      return { label: 'Customer', color: '#6b7280', bg: '#f3f4f6' }
  }
}

export default function UsersScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'sale' as 'sale' | 'sale_admin' | 'admin' | 'customer',
  })
  const [creating, setCreating] = useState(false)

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
        .select('role')
        .eq('id', authUser.id)
        .single()

      const isAdmin = profileData?.role === 'admin'
      const isSaleAdmin = profileData?.role === 'sale_admin'

      if (!isAdmin && !isSaleAdmin) {
        Alert.alert('Lỗi', 'Bạn không có quyền truy cập trang này')
        router.replace('/(sales)/dashboard')
        return
      }

      setProfile(profileData)

      // Fetch all profiles (exclude customers - they are in Customers page)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'customer') // Exclude customers
        .order('created_at', { ascending: false })

      console.log('Fetched profiles:', profilesData?.length, 'users')

      // Add manager info
      const profilesWithManager = (profilesData || []).map(p => ({
        ...p,
        manager: profilesData?.find(m => m.id === p.manager_id)
      }))

      setProfiles(profilesWithManager)
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

  const handleCreateUser = async () => {
    // Validation
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      Alert.alert('Lỗi', 'Email không đúng định dạng')
      return
    }

    // Validate password length
    if (newUser.password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    // Validate full name
    if (newUser.full_name.trim().length < 2) {
      Alert.alert('Lỗi', 'Họ tên phải có ít nhất 2 ký tự')
      return
    }

    // Validate phone (nếu có)
    if (newUser.phone) {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(newUser.phone.replace(/\s/g, ''))) {
        Alert.alert('Lỗi', 'Số điện thoại phải có 10-11 chữ số')
        return
      }
    }

    try {
      setCreating(true)

      // Create auth user (không dùng trigger)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email.trim().toLowerCase(),
        password: newUser.password,
      })

      if (authError) throw authError

      // Tạo profile thủ công (không dùng trigger)
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: newUser.full_name.trim(),
            phone: newUser.phone?.trim() || null,
            role: newUser.role,
          })

        if (profileError) throw profileError

        Alert.alert('Thành công', 'Đã tạo người dùng mới')
        setShowAddModal(false)
        setNewUser({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          role: 'sale',
        })
        fetchData()
      }
    } catch (error: any) {
      console.error('Error creating user:', error)
      Alert.alert('Lỗi', error.message || 'Không thể tạo người dùng')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === user?.id) {
      Alert.alert('Lỗi', 'Bạn không thể xóa chính mình')
      return
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa người dùng "${userName}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId)

              if (error) throw error

              Alert.alert('Thành công', 'Đã xóa người dùng')
              fetchData()
            } catch (error) {
              console.error('Error deleting user:', error)
              Alert.alert('Lỗi', 'Không thể xóa người dùng')
            }
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  const isAdmin = profile?.role === 'admin'

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
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Quản lý người dùng</Text>
          <Text style={styles.subtitle}>
            {profiles.length} người dùng
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="person-add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Users List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {profiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Chưa có nhân viên nào trong nhóm</Text>
          </View>
        ) : (
          profiles.map((p) => {
            const roleBadge = getRoleBadge(p.role)
            
            return (
              <TouchableOpacity
                key={p.id}
                style={styles.userCard}
                onPress={() => router.push(`/(sales)/users/${p.id}`)}
                activeOpacity={0.7}
              >
                <View style={[styles.userCardTop, { backgroundColor: 'rgba(23, 94, 173, 0.1)' }]} />
                
                <View style={styles.userCardHeader}>
                  <View style={styles.userIconContainer}>
                    <View style={styles.userIcon}>
                      <Ionicons 
                        name={p.role === 'admin' ? 'shield' : 'person'} 
                        size={24} 
                        color={p.role === 'admin' ? '#ef4444' : '#175ead'} 
                      />
                    </View>
                  </View>
                  <View style={[styles.roleBadge, { backgroundColor: roleBadge.bg }]}>
                    <Text style={[styles.roleBadgeText, { color: roleBadge.color }]}>
                      {roleBadge.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.userCardBody}>
                  <Text style={styles.userName}>{p.full_name || 'No Name'}</Text>
                  <Text style={styles.userId}>ID: {p.id.substring(0, 8)}...</Text>

                  <View style={styles.userInfo}>
                    <View style={styles.userInfoRow}>
                      <Text style={styles.userInfoLabel}>Điện thoại:</Text>
                      <Text style={styles.userInfoValue}>{p.phone || '---'}</Text>
                    </View>
                    <View style={styles.userInfoRow}>
                      <Text style={styles.userInfoLabel}>Ngày tham gia:</Text>
                      <Text style={styles.userInfoValue}>
                        {new Date(p.created_at).toLocaleDateString('vi-VN')}
                      </Text>
                    </View>
                    {p.manager && (
                      <View style={styles.managerInfo}>
                        <Text style={styles.managerLabel}>QUẢN LÝ:</Text>
                        <Text style={styles.managerName}>{p.manager.full_name}</Text>
                      </View>
                    )}
                  </View>

                  {isAdmin && p.id !== user?.id && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteUser(p.id, p.full_name)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      <Text style={styles.deleteButtonText}>Xóa người dùng</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm người dùng mới</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  value={newUser.email}
                  onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!creating}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mật khẩu *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tối thiểu 6 ký tự"
                  value={newUser.password}
                  onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                  secureTextEntry
                  editable={!creating}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nguyễn Văn A"
                  value={newUser.full_name}
                  onChangeText={(text) => setNewUser({ ...newUser, full_name: text })}
                  editable={!creating}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0123456789"
                  value={newUser.phone}
                  onChangeText={(text) => setNewUser({ ...newUser, phone: text })}
                  keyboardType="phone-pad"
                  editable={!creating}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vai trò *</Text>
                <View style={styles.roleButtons}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      newUser.role === 'customer' && styles.roleButtonActiveGreen
                    ]}
                    onPress={() => setNewUser({ ...newUser, role: 'customer' })}
                    disabled={creating}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      newUser.role === 'customer' && styles.roleButtonTextActive
                    ]}>
                      Khách hàng
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      newUser.role === 'sale' && styles.roleButtonActive
                    ]}
                    onPress={() => setNewUser({ ...newUser, role: 'sale' })}
                    disabled={creating}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      newUser.role === 'sale' && styles.roleButtonTextActive
                    ]}>
                      Sale
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      newUser.role === 'sale_admin' && styles.roleButtonActiveOrange
                    ]}
                    onPress={() => setNewUser({ ...newUser, role: 'sale_admin' })}
                    disabled={creating}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      newUser.role === 'sale_admin' && styles.roleButtonTextActive
                    ]}>
                      Sale Admin
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      newUser.role === 'admin' && styles.roleButtonActiveRed
                    ]}
                    onPress={() => setNewUser({ ...newUser, role: 'admin' })}
                    disabled={creating}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      newUser.role === 'admin' && styles.roleButtonTextActive
                    ]}>
                      Admin
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddModal(false)}
                disabled={creating}
              >
                <Text style={styles.modalCancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalCreateButton, creating && styles.modalCreateButtonDisabled]}
                onPress={handleCreateUser}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.modalCreateButtonText}>Tạo người dùng</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
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
  userCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userCardTop: {
    height: 8,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  userIconContainer: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  userIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  userCardBody: {
    padding: 16,
    paddingTop: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userId: {
    fontSize: 10,
    color: '#9ca3af',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  userInfo: {
    gap: 8,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  userInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  managerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  managerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  managerName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fef2f2',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  roleButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  roleButtonActiveGreen: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  roleButtonActiveOrange: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  roleButtonActiveRed: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  roleButtonTextActive: {
    color: 'white',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalCreateButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#175ead',
    alignItems: 'center',
  },
  modalCreateButtonDisabled: {
    opacity: 0.5,
  },
  modalCreateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
