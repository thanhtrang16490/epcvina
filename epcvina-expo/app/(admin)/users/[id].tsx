import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Alert, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return { label: 'Admin', color: '#ef4444', bg: '#fee2e2', icon: 'shield' }
    case 'sale_admin':
      return { label: 'Sale Admin', color: '#f59e0b', bg: '#fef3c7', icon: 'shield-checkmark' }
    case 'sale':
      return { label: 'Sale', color: '#6366f1', bg: '#e0e7ff', icon: 'person' }
    default:
      return { label: 'Customer', color: '#6b7280', bg: '#f3f4f6', icon: 'person-outline' }
  }
}

export default function UserDetailScreen() {
  const { user: currentUser } = useAuth()
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [currentProfile, setCurrentProfile] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [manager, setManager] = useState<any>(null)
  const [managedUsers, setManagedUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    full_name: '',
    phone: '',
    address: '',
    role: 'sale' as 'sale' | 'sale_admin' | 'admin' | 'customer',
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      // Fetch current user profile
      const { data: currentProfileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      const isAdmin = currentProfileData?.role === 'admin'
      const isSaleAdmin = currentProfileData?.role === 'sale_admin'

      if (!isAdmin && !isSaleAdmin) {
        Alert.alert('Lỗi', 'Bạn không có quyền truy cập')
        router.back()
        return
      }

      setCurrentProfile(currentProfileData)

      // Fetch user profile
      const { data: userProfileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (!userProfileData) {
        Alert.alert('Lỗi', 'Không tìm thấy người dùng')
        router.back()
        return
      }

      setUserProfile(userProfileData)
      setEditedData({
        full_name: userProfileData.full_name || '',
        phone: userProfileData.phone || '',
        address: userProfileData.address || '',
        role: userProfileData.role || 'sale',
      })

      // Fetch manager if exists
      if (userProfileData.manager_id) {
        const { data: managerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userProfileData.manager_id)
          .single()
        setManager(managerData)
      }

      // Fetch managed users if user is sale_admin
      if (userProfileData.role === 'sale_admin') {
        const { data: managedData } = await supabase
          .from('profiles')
          .select('*')
          .eq('manager_id', id)
        setManagedUsers(managedData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedData.full_name,
          phone: editedData.phone,
          address: editedData.address,
          role: editedData.role,
        })
        .eq('id', id)

      if (error) throw error

      Alert.alert('Thành công', 'Đã cập nhật thông tin')
      setEditing(false)
      fetchData()
    } catch (error) {
      console.error('Error updating user:', error)
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin')
    }
  }

  const handleDelete = () => {
    if (id === currentUser?.id) {
      Alert.alert('Lỗi', 'Bạn không thể xóa chính mình')
      return
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa người dùng "${userProfile?.full_name}"?`,
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
                .eq('id', id)

              if (error) throw error

              Alert.alert('Thành công', 'Đã xóa người dùng')
              router.back()
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

  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy người dùng</Text>
      </View>
    )
  }

  const roleBadge = getRoleBadge(userProfile.role)
  const isAdmin = currentProfile?.role === 'admin'

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết người dùng</Text>
        <View style={styles.headerRight}>
          {editing ? (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={24} color="#10b981" />
            </TouchableOpacity>
          ) : (
            isAdmin && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setEditing(true)}
              >
                <Ionicons name="create-outline" size={24} color="#175ead" />
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.profileCardTop, { backgroundColor: roleBadge.bg }]} />
          
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: roleBadge.bg }]}>
              <Ionicons name={roleBadge.icon as any} size={40} color={roleBadge.color} />
            </View>
            <View style={[styles.roleBadge, { backgroundColor: roleBadge.bg }]}>
              <Text style={[styles.roleBadgeText, { color: roleBadge.color }]}>
                {roleBadge.label}
              </Text>
            </View>
          </View>

          <View style={styles.profileBody}>
            {editing ? (
              <>
                <Text style={styles.inputLabel}>Họ và tên</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.full_name}
                  onChangeText={(text) => setEditedData({ ...editedData, full_name: text })}
                  placeholder="Nhập họ và tên"
                />
                
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.phone}
                  onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                />
                
                <Text style={styles.inputLabel}>Địa chỉ</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedData.address}
                  onChangeText={(text) => setEditedData({ ...editedData, address: text })}
                  placeholder="Nhập địa chỉ"
                  multiline
                  numberOfLines={3}
                />
                
                <Text style={styles.inputLabel}>Vai trò</Text>
                <View style={styles.roleButtons}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      editedData.role === 'customer' && styles.roleButtonActiveGreen
                    ]}
                    onPress={() => setEditedData({ ...editedData, role: 'customer' })}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      editedData.role === 'customer' && styles.roleButtonTextActive
                    ]}>
                      Khách hàng
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      editedData.role === 'sale' && styles.roleButtonActive
                    ]}
                    onPress={() => setEditedData({ ...editedData, role: 'sale' })}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      editedData.role === 'sale' && styles.roleButtonTextActive
                    ]}>
                      Sale
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      editedData.role === 'sale_admin' && styles.roleButtonActiveOrange
                    ]}
                    onPress={() => setEditedData({ ...editedData, role: 'sale_admin' })}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      editedData.role === 'sale_admin' && styles.roleButtonTextActive
                    ]}>
                      Sale Admin
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      editedData.role === 'admin' && styles.roleButtonActiveRed
                    ]}
                    onPress={() => setEditedData({ ...editedData, role: 'admin' })}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      editedData.role === 'admin' && styles.roleButtonTextActive
                    ]}>
                      Admin
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.userName}>{userProfile.full_name || 'No Name'}</Text>
                <Text style={styles.userEmail}>{userProfile.email}</Text>
              </>
            )}
          </View>
        </View>

        {/* Info Section */}
        {!editing && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="card-outline" size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>ID</Text>
                <Text style={styles.infoValue}>{userProfile.id}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="call-outline" size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Điện thoại</Text>
                <Text style={styles.infoValue}>{userProfile.phone || '---'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Địa chỉ</Text>
                <Text style={styles.infoValue}>{userProfile.address || '---'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Ngày tham gia</Text>
                <Text style={styles.infoValue}>
                  {new Date(userProfile.created_at).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Manager Section */}
        {manager && !editing && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Quản lý</Text>
            <View style={styles.managerCard}>
              <View style={styles.managerAvatar}>
                <Ionicons name="person" size={24} color="#175ead" />
              </View>
              <View style={styles.managerInfo}>
                <Text style={styles.managerName}>{manager.full_name}</Text>
                <Text style={styles.managerRole}>
                  {getRoleBadge(manager.role).label}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Managed Users Section */}
        {managedUsers.length > 0 && !editing && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>
              Nhân viên quản lý ({managedUsers.length})
            </Text>
            {managedUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.managedUserCard}
                onPress={() => router.push(`/(sales)/users/${user.id}`)}
              >
                <View style={styles.managedUserAvatar}>
                  <Ionicons name="person" size={20} color="#6366f1" />
                </View>
                <View style={styles.managedUserInfo}>
                  <Text style={styles.managedUserName}>{user.full_name}</Text>
                  <Text style={styles.managedUserRole}>
                    {getRoleBadge(user.role).label}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Delete Button */}
        {isAdmin && id !== currentUser?.id && !editing && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.deleteButtonText}>Xóa người dùng</Text>
          </TouchableOpacity>
        )}

        {/* Cancel Button when editing */}
        {editing && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditing(false)
              setEditedData({
                full_name: userProfile.full_name || '',
                phone: userProfile.phone || '',
                address: userProfile.address || '',
                role: userProfile.role || 'sale',
              })
            }}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        )}
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
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
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
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
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
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileCardTop: {
    height: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileBody: {
    padding: 20,
    paddingTop: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  managerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
  },
  managerAvatar: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  managerInfo: {
    flex: 1,
  },
  managerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  managerRole: {
    fontSize: 12,
    color: '#6b7280',
  },
  managedUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 8,
  },
  managedUserAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  managedUserInfo: {
    flex: 1,
  },
  managedUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  managedUserRole: {
    fontSize: 11,
    color: '#6b7280',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  roleButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  roleButtonTextActive: {
    color: 'white',
  },
})
