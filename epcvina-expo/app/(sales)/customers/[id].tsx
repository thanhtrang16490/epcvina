import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'

export default function CustomerDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [profile, setProfile] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [saleUsers, setSaleUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newAccountPassword, setNewAccountPassword] = useState('')
  const [creatingAccount, setCreatingAccount] = useState(false)
  const [editedData, setEditedData] = useState({
    full_name: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    assigned_to: '',
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

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      if (!profileData || !['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
        Alert.alert('Lỗi', 'Bạn không có quyền truy cập')
        router.back()
        return
      }

      setProfile(profileData)

      // Fetch customer from customers table
      const { data: customerData } = await supabase
        .from('customers')
        .select(`
          *,
          assigned_sale:profiles!customers_assigned_to_fkey(id, full_name, email)
        `)
        .eq('id', id)
        .single()

      if (!customerData) {
        Alert.alert('Lỗi', 'Không tìm thấy khách hàng')
        router.back()
        return
      }

      setCustomer(customerData)
      setEditedData({
        full_name: customerData.full_name || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        email: customerData.email || '',
        password: '',
        assigned_to: customerData.assigned_to || '',
      })

      // Fetch sale users for assignment (only for admin/sale_admin)
      if (['admin', 'sale_admin'].includes(profileData.role)) {
        let saleQuery = supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('role', 'sale')
          .order('full_name', { ascending: true })

        // If sale_admin, only show their team
        if (profileData.role === 'sale_admin') {
          saleQuery = saleQuery.eq('manager_id', authUser.id)
        }

        const { data: saleData } = await saleQuery
        setSaleUsers(saleData || [])
      }

      // Fetch customer orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, created_at, status, total_amount')
        .eq('customer_id', id)
        .order('created_at', { ascending: false })
        .limit(5)

      setOrders(ordersData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Validate password if provided
      if (editedData.password && editedData.password.trim()) {
        if (editedData.password.length < 6) {
          Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
          return
        }

        if (!customer.user_id) {
          Alert.alert('Lỗi', 'Khách hàng chưa có tài khoản đăng nhập. Không thể đổi mật khẩu.')
          return
        }
      }

      const updateData: any = {
        full_name: editedData.full_name,
        phone: editedData.phone,
        address: editedData.address,
        email: editedData.email,
        assigned_to: editedData.assigned_to || null,
      }

      const { error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      // Show message about password change limitation
      if (editedData.password && editedData.password.trim()) {
        Alert.alert(
          'Lưu ý',
          `Thông tin đã được cập nhật.\n\nĐể đổi mật khẩu, khách hàng cần:\n1. Vào trang đăng nhập\n2. Chọn "Quên mật khẩu"\n3. Nhập email: ${customer.email}\n4. Làm theo hướng dẫn trong email\n\nHoặc liên hệ admin hệ thống.`,
          [{ text: 'OK' }]
        )
      } else if (customer.user_id && editedData.email !== customer.email) {
        // If customer has user_id (can login), we need to update auth.users.email too
        Alert.alert(
          'Lưu ý',
          'Email đã được cập nhật trong hệ thống. Nếu khách hàng có tài khoản đăng nhập, họ cần liên hệ admin để cập nhật email đăng nhập.',
          [{ text: 'OK' }]
        )
      } else {
        Alert.alert('Thành công', 'Đã cập nhật thông tin khách hàng')
      }

      setEditing(false)
      fetchData()
    } catch (error) {
      console.error('Error updating customer:', error)
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin')
    }
  }

  const handleCreateAccount = () => {
    if (!customer.email) {
      Alert.alert('Lỗi', 'Khách hàng chưa có email. Vui lòng cập nhật email trước.')
      return
    }
    setNewAccountPassword('')
    setShowPasswordModal(true)
  }

  const handleConfirmCreateAccount = async () => {
    if (!newAccountPassword || newAccountPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      setCreatingAccount(true)

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: customer.email,
        password: newAccountPassword,
        options: {
          data: {
            full_name: customer.full_name,
            phone: customer.phone,
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          Alert.alert('Lỗi', 'Email này đã được sử dụng cho tài khoản khác.')
        } else {
          Alert.alert('Lỗi', authError.message)
        }
        return
      }

      const { error: updateError } = await supabase
        .from('customers')
        .update({ user_id: authData.user?.id })
        .eq('id', id)

      if (updateError) throw updateError

      setShowPasswordModal(false)
      Alert.alert(
        'Thành công',
        `Đã tạo tài khoản đăng nhập.\n\nEmail: ${customer.email}\nMật khẩu: ${newAccountPassword}\n\nVui lòng gửi thông tin này cho khách hàng.`,
        [{ text: 'OK', onPress: () => fetchData() }]
      )
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tạo tài khoản')
    } finally {
      setCreatingAccount(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string }> = {
      draft: { label: 'Nháp', color: '#6b7280', bg: '#f3f4f6' },
      ordered: { label: 'Đặt hàng', color: '#d97706', bg: '#fef3c7' },
      shipping: { label: 'Giao hàng', color: '#2563eb', bg: '#dbeafe' },
      paid: { label: 'Thanh toán', color: '#9333ea', bg: '#f3e8ff' },
      completed: { label: 'Hoàn thành', color: '#059669', bg: '#d1fae5' },
      cancelled: { label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2' }
    }
    return statusMap[status] || statusMap.draft
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  if (!customer) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy khách hàng</Text>
      </View>
    )
  }

  const isAdmin = profile?.role === 'admin'

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
        <Text style={styles.headerTitle}>Chi tiết khách hàng</Text>
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
        {/* Customer Card */}
        <View style={styles.customerCard}>
          <View style={styles.customerCardTop} />
          
          <View style={styles.customerHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#10b981" />
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Khách hàng</Text>
            </View>
          </View>

          <View style={styles.customerBody}>
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
                
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.email}
                  onChangeText={(text) => setEditedData({ ...editedData, email: text })}
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                
                <Text style={styles.inputLabel}>Mật khẩu mới (tùy chọn)</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.password}
                  onChangeText={(text) => setEditedData({ ...editedData, password: text })}
                  placeholder="Nhập mật khẩu mới (tùy chọn)"
                  secureTextEntry
                  autoCapitalize="none"
                />
                <Text style={styles.passwordHint}>Để trống nếu không muốn đổi mật khẩu. Tối thiểu 6 ký tự.</Text>
                
                {/* Sale Assignment - Only for admin/sale_admin */}
                {['admin', 'sale_admin'].includes(profile?.role) && (
                  <>
                    <Text style={styles.inputLabel}>Sale phụ trách</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={editedData.assigned_to}
                        onValueChange={(value) => setEditedData({ ...editedData, assigned_to: value })}
                        style={styles.picker}
                      >
                        <Picker.Item label="-- Chưa gán --" value="" />
                        {saleUsers.map((sale) => (
                          <Picker.Item 
                            key={sale.id} 
                            label={`${sale.full_name} (${sale.email})`} 
                            value={sale.id} 
                          />
                        ))}
                      </Picker>
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                <Text style={styles.customerName}>{customer.full_name || 'No Name'}</Text>
                <Text style={styles.customerEmail}>{customer.email}</Text>
              </>
            )}
          </View>
        </View>

        {/* Info Section */}
        {!editing && (
          <>
            {/* Contact Info */}
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
              
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="call-outline" size={20} color="#6b7280" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Điện thoại</Text>
                  <Text style={styles.infoValue}>{customer.phone || '---'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="mail-outline" size={20} color="#6b7280" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{customer.email || '---'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="location-outline" size={20} color="#6b7280" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Địa chỉ</Text>
                  <Text style={styles.infoValue}>{customer.address || '---'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Ngày tham gia</Text>
                  <Text style={styles.infoValue}>
                    {new Date(customer.created_at).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>

              {/* Sale phụ trách */}
              {['admin', 'sale_admin'].includes(profile?.role) && (
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="person-outline" size={20} color="#6b7280" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Sale phụ trách</Text>
                    <Text style={styles.infoValue}>
                      {customer.assigned_sale?.full_name || 'Chưa gán'}
                    </Text>
                    {customer.assigned_sale?.email && (
                      <Text style={styles.infoSubValue}>{customer.assigned_sale.email}</Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            {/* Recent Orders */}
            <View style={styles.infoCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
                <Text style={styles.sectionSubtitle}>({orders.length})</Text>
              </View>
              
              {orders.length > 0 ? (
                orders.map((order) => {
                  const statusBadge = getStatusBadge(order.status)
                  return (
                    <TouchableOpacity
                      key={order.id}
                      style={styles.orderItem}
                      onPress={() => router.push(`/(sales)/orders/${order.id}`)}
                    >
                      <View style={styles.orderItemLeft}>
                        <View style={styles.orderIcon}>
                          <Ionicons name="receipt-outline" size={20} color="#175ead" />
                        </View>
                        <View style={styles.orderInfo}>
                          <Text style={styles.orderNumber}>Đơn #{order.id}</Text>
                          <Text style={styles.orderDate}>
                            {new Date(order.created_at).toLocaleDateString('vi-VN')}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.orderItemRight}>
                        <Text style={styles.orderAmount}>{formatCurrency(order.total_amount)}</Text>
                        <View style={[styles.orderStatus, { backgroundColor: statusBadge.bg }]}>
                          <Text style={[styles.orderStatusText, { color: statusBadge.color }]}>
                            {statusBadge.label}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })
              ) : (
                <View style={styles.emptyOrders}>
                  <Ionicons name="receipt-outline" size={32} color="#d1d5db" />
                  <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Cancel Button when editing */}
        {editing && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditing(false)
              setEditedData({
                full_name: customer.full_name || '',
                phone: customer.phone || '',
                address: customer.address || '',
                email: customer.email || '',
                password: '',
                assigned_to: customer.assigned_to || '',
              })
            }}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Password Modal - thay thế Alert.prompt (không hoạt động trên Android) */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="person-add" size={24} color="#175ead" />
              <Text style={styles.modalTitle}>Tạo tài khoản đăng nhập</Text>
            </View>

            <Text style={styles.modalSubtitle}>
              Email: <Text style={styles.modalEmail}>{customer?.email}</Text>
            </Text>

            <Text style={styles.modalLabel}>Mật khẩu (tối thiểu 6 ký tự)</Text>
            <TextInput
              style={styles.modalInput}
              value={newAccountPassword}
              onChangeText={setNewAccountPassword}
              placeholder="Nhập mật khẩu..."
              secureTextEntry
              autoCapitalize="none"
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowPasswordModal(false)}
                disabled={creatingAccount}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConfirmBtn, creatingAccount && { opacity: 0.6 }]}
                onPress={handleConfirmCreateAccount}
                disabled={creatingAccount}
              >
                {creatingAccount ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.modalConfirmText}>Tạo tài khoản</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  customerCardTop: {
    height: 8,
    backgroundColor: '#d1fae5',
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#d1fae5',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#d1fae5',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },
  customerBody: {
    padding: 20,
    paddingTop: 8,
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  customerEmail: {
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
  passwordHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  infoSubValue: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
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
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  orderIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderItemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyOrders: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
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
  // Password Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  modalEmail: {
    color: '#175ead',
    fontWeight: '600',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalConfirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#175ead',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
})
