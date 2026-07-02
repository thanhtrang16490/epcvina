import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function SettingsScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    companyName: 'APPE JV',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    taxRate: 10,
    currency: 'VNĐ',
    lowStockThreshold: 20,
    enableNotifications: true,
    enableEmailAlerts: false,
    autoApproveOrders: false,
    requireCustomerApproval: true,
  })

  useEffect(() => {
    checkAccess()
    fetchSettings()
  }, [])

  const checkAccess = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.replace('/(auth)/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authUser.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      router.replace('/(sales)/dashboard')
    }
  }

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // In a real app, fetch from a settings table
      // For now, using default values
      setLoading(false)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      Alert.alert('Thành công', 'Cài đặt đã được lưu')
    } catch (error) {
      console.error('Error saving settings:', error)
      Alert.alert('Lỗi', 'Không thể lưu cài đặt')
    } finally {
      setSaving(false)
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt hệ thống</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Company Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin công ty</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên công ty</Text>
            <TextInput
              style={styles.input}
              value={settings.companyName}
              onChangeText={(text) => setSettings({ ...settings, companyName: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={settings.companyEmail}
              onChangeText={(text) => setSettings({ ...settings, companyEmail: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={settings.companyPhone}
              onChangeText={(text) => setSettings({ ...settings, companyPhone: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={settings.companyAddress}
              onChangeText={(text) => setSettings({ ...settings, companyAddress: text })}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Business Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt kinh doanh</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Thuế VAT (%)</Text>
            <TextInput
              style={styles.input}
              value={settings.taxRate.toString()}
              onChangeText={(text) => setSettings({ ...settings, taxRate: parseFloat(text) || 0 })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Đơn vị tiền tệ</Text>
            <TextInput
              style={styles.input}
              value={settings.currency}
              onChangeText={(text) => setSettings({ ...settings, currency: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ngưỡng cảnh báo tồn kho</Text>
            <TextInput
              style={styles.input}
              value={settings.lowStockThreshold.toString()}
              onChangeText={(text) => setSettings({ ...settings, lowStockThreshold: parseInt(text) || 0 })}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông báo</Text>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchTitle}>Bật thông báo</Text>
              <Text style={styles.switchDescription}>Nhận thông báo trong ứng dụng</Text>
            </View>
            <Switch
              value={settings.enableNotifications}
              onValueChange={(value) => setSettings({ ...settings, enableNotifications: value })}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={settings.enableNotifications ? '#175ead' : '#f3f4f6'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchTitle}>Cảnh báo qua email</Text>
              <Text style={styles.switchDescription}>Gửi email khi có sự kiện quan trọng</Text>
            </View>
            <Switch
              value={settings.enableEmailAlerts}
              onValueChange={(value) => setSettings({ ...settings, enableEmailAlerts: value })}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={settings.enableEmailAlerts ? '#175ead' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Order Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng</Text>
          
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchTitle}>Tự động duyệt đơn</Text>
              <Text style={styles.switchDescription}>Đơn hàng được duyệt tự động</Text>
            </View>
            <Switch
              value={settings.autoApproveOrders}
              onValueChange={(value) => setSettings({ ...settings, autoApproveOrders: value })}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={settings.autoApproveOrders ? '#175ead' : '#f3f4f6'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchTitle}>Yêu cầu xác nhận khách hàng</Text>
              <Text style={styles.switchDescription}>Khách hàng phải xác nhận đơn hàng</Text>
            </View>
            <Switch
              value={settings.requireCustomerApproval}
              onValueChange={(value) => setSettings({ ...settings, requireCustomerApproval: value })}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={settings.requireCustomerApproval ? '#175ead' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.saveButtonText}>Lưu cài đặt</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
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
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  saveContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: '#175ead',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
