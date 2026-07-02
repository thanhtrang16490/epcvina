import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, ActivityIndicator, Image, Modal, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function AccountScreen() {
  const { user, signOut, refreshUser } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
  })
  const [editedProfile, setEditedProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    fetchProfile()
    loadNotificationSettings()
  }, [])

  const fetchProfile = async () => {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, address')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name,
          phone: editedProfile.phone,
          address: editedProfile.address,
        })
        .eq('id', user?.id)

      if (error) throw error

      await refreshUser()
      setProfile(editedProfile)
      setShowEditModal(false)
      Alert.alert('Thành công', 'Cập nhật thông tin thành công')
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenEditModal = () => {
    setEditedProfile({ ...profile })
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditedProfile({ ...profile })
  }

  const loadNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('notifications_enabled')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setNotificationsEnabled(data?.notifications_enabled ?? true)
    } catch (error) {
      console.error('Error loading notification settings:', error)
    }
  }

  const toggleNotifications = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notifications_enabled: enabled })
        .eq('id', user?.id)

      if (error) throw error
      setNotificationsEnabled(enabled)
    } catch (error) {
      console.error('Error updating notification settings:', error)
      Alert.alert('Lỗi', 'Không thể cập nhật cài đặt thông báo')
    }
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      setShowLogoutModal(false)
      router.replace('/(auth)/login')
    } catch (error) {
      console.error('Error logging out:', error)
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoTitle}>APPE JV</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#10b981" />
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>Khách hàng</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.full_name || 'Khách hàng'}</Text>
          <Text style={styles.userEmail}>{user?.email || user?.phone}</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            <TouchableOpacity onPress={handleOpenEditModal}>
              <Ionicons name="create-outline" size={20} color="#10b981" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Họ và tên</Text>
                <Text style={styles.infoValue}>{profile.full_name || 'Chưa cập nhật'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="call-outline" size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                <Text style={styles.infoValue}>{profile.phone || 'Chưa cập nhật'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Địa chỉ</Text>
                <Text style={styles.infoValue}>{profile.address || 'Chưa cập nhật'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => setShowNotificationSettings(true)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name="notifications-outline" size={24} color="#6b7280" />
                <Text style={styles.menuText}>Thông báo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="help-circle-outline" size={24} color="#6b7280" />
                <Text style={styles.menuText}>Trợ giúp</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="information-circle-outline" size={24} color="#6b7280" />
                <Text style={styles.menuText}>Về chúng tôi</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sửa thông tin</Text>
              <TouchableOpacity onPress={handleCloseEditModal}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Họ và tên</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#6b7280" />
                  <TextInput
                    style={styles.modalInput}
                    value={editedProfile.full_name}
                    onChangeText={(text) => setEditedProfile({ ...editedProfile, full_name: text })}
                    placeholder="Nhập họ và tên"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Số điện thoại</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#6b7280" />
                  <TextInput
                    style={styles.modalInput}
                    value={editedProfile.phone}
                    onChangeText={(text) => setEditedProfile({ ...editedProfile, phone: text })}
                    placeholder="Nhập số điện thoại"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Địa chỉ</Text>
                <View style={[styles.inputContainer, styles.textareaContainer]}>
                  <Ionicons name="location-outline" size={20} color="#6b7280" style={styles.textareaIcon} />
                  <TextInput
                    style={[styles.modalInput, styles.textarea]}
                    value={editedProfile.address}
                    onChangeText={(text) => setEditedProfile({ ...editedProfile, address: text })}
                    placeholder="Nhập địa chỉ"
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleCloseEditModal}
              >
                <Text style={styles.modalCancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.modalSaveButtonText}>Lưu</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal
        visible={showNotificationSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotificationSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cài đặt thông báo</Text>
              <TouchableOpacity onPress={() => setShowNotificationSettings(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconContainer}>
                    <Ionicons name="notifications" size={24} color="#10b981" />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Thông báo hệ thống</Text>
                    <Text style={styles.settingDescription}>
                      Nhận thông báo về đơn hàng, sản phẩm và cập nhật
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.toggle,
                    notificationsEnabled && styles.toggleActive
                  ]}
                  onPress={() => toggleNotifications(!notificationsEnabled)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.toggleThumb,
                    notificationsEnabled && styles.toggleThumbActive
                  ]} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingNote}>
                <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
                <Text style={styles.settingNoteText}>
                  Bạn có thể bật/tắt thông báo bất cứ lúc nào
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.confirmOverlay}>
          <TouchableOpacity
            style={styles.confirmBackdrop}
            activeOpacity={1}
            onPress={() => !isLoggingOut && setShowLogoutModal(false)}
          />
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconWrap}>
              <Ionicons name="log-out-outline" size={26} color="#ef4444" />
            </View>

            <Text style={styles.confirmTitle}>Đăng xuất tài khoản</Text>
            <Text style={styles.confirmMessage}>
              Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?
            </Text>

            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
              >
                <Text style={styles.confirmCancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmLogoutButton}
                onPress={confirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="log-out-outline" size={16} color="white" />
                    <Text style={styles.confirmLogoutText}>Đăng xuất</Text>
                  </>
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
  header: {
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
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#d1fae5',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadge: {
    position: 'absolute',
    bottom: 0,
    right: -8,
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  versionContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textareaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textareaIcon: {
    marginTop: 2,
  },
  modalInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalSaveButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10b981',
  },
  modalSaveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#d1fae5',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  toggle: {
    width: 52,
    height: 32,
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#10b981',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    backgroundColor: 'white',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  settingNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  settingNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  confirmBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  confirmActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  confirmCancelText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmLogoutButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ef4444',
  },
  confirmLogoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
})
