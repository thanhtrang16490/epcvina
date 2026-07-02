import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../../src/lib/supabase'

export default function AddCustomerScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    password: '', // Bắt buộc
  })

  const handleSubmit = async () => {
    // Validation
    if (!formData.full_name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên khách hàng')
      return
    }

    if (!formData.phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại')
      return
    }

    if (!formData.email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ')
      return
    }

    if (!formData.password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu')
      return
    }

    if (formData.password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      setLoading(true)

      // Get current user to set as assigned_to
      const { data: { user } } = await supabase.auth.getUser()

      // Create auth account (REQUIRED for all customers)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
          }
        }
      })

      if (authError) {
        // Check if email already exists
        if (authError.message.includes('already registered')) {
          Alert.alert('Lỗi', 'Email này đã được sử dụng. Vui lòng chọn email khác.')
        } else {
          Alert.alert('Lỗi', authError.message)
        }
        return
      }

      // Create customer in customers table with user_id
      const { data, error } = await supabase
        .from('customers')
        .insert({
          user_id: authData.user?.id, // Always link to auth account
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          assigned_to: user?.id, // Assign to current user
        })
        .select()
        .single()

      if (error) throw error

      Alert.alert(
        'Thành công',
        `Đã tạo khách hàng mới với tài khoản đăng nhập.\n\nEmail: ${formData.email}\nMật khẩu: ${formData.password}\n\nVui lòng gửi thông tin này cho khách hàng.`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      )
    } catch (error: any) {
      console.error('Error creating customer:', error)
      Alert.alert('Lỗi', error.message || 'Có lỗi khi tạo khách hàng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm khách hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Full Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Tên khách hàng <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên khách hàng"
            value={formData.full_name}
            onChangeText={(text) => setFormData({ ...formData, full_name: text })}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Phone */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Số điện thoại <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Email */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9ca3af"
          />
          <Text style={styles.hint}>
            Email sẽ được dùng để đăng nhập vào hệ thống
          </Text>
        </View>

        {/* Password */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Mật khẩu <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            placeholderTextColor="#9ca3af"
          />
          <Text style={styles.hint}>
            Mật khẩu này sẽ được gửi cho khách hàng để đăng nhập
          </Text>
        </View>

        {/* Address */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Nhập địa chỉ (tùy chọn)"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Đang tạo...' : 'Tạo khách hàng'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#175ead',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
    fontStyle: 'italic',
  },
})
