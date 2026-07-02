import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import SuccessModal from '../../../src/components/SuccessModal'

export default function AddProductScreen() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category_id: '',
    description: '',
    price: '',
    stock: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm')
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá hợp lệ')
      return
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số lượng hợp lệ')
      return
    }

    try {
      setSaving(true)

      const { error } = await supabase
        .from('products')
        .insert({
          name: formData.name.trim(),
          code: formData.code.trim() || null,
          category_id: formData.category_id || null,
          description: formData.description.trim() || null,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        })

      if (error) throw error

      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error creating product:', error)
      Alert.alert('Lỗi', 'Không thể tạo sản phẩm')
    } finally {
      setSaving(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    router.back()
  }

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
        <Text style={styles.headerTitle}>Thêm sản phẩm mới</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Tên sản phẩm *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Nhập tên sản phẩm"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.inputLabel}>Mã sản phẩm</Text>
          <TextInput
            style={styles.input}
            value={formData.code}
            onChangeText={(text) => setFormData({ ...formData, code: text })}
            placeholder="Nhập mã sản phẩm (tùy chọn)"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.inputLabel}>Danh mục</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={[styles.pickerButtonText, !formData.category_id && styles.placeholderText]}>
              {categories.find(c => c.id === formData.category_id)?.name || 'Chọn danh mục'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6b7280" />
          </TouchableOpacity>

          {showCategoryPicker && (
            <View style={styles.pickerContainer}>
              <ScrollView style={styles.pickerScroll}>
                <TouchableOpacity
                  style={styles.pickerOption}
                  onPress={() => {
                    setFormData({ ...formData, category_id: '' })
                    setShowCategoryPicker(false)
                  }}
                >
                  <Text style={styles.pickerOptionText}>-- Không chọn --</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.pickerOption,
                      formData.category_id === cat.id && styles.pickerOptionActive
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, category_id: cat.id })
                      setShowCategoryPicker(false)
                    }}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.category_id === cat.id && styles.pickerOptionTextActive
                    ]}>
                      {cat.name}
                    </Text>
                    {formData.category_id === cat.id && (
                      <Ionicons name="checkmark" size={20} color="#175ead" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <Text style={styles.inputLabel}>Mô tả</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Nhập mô tả sản phẩm (tùy chọn)"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.inputLabel}>Giá bán (VNĐ) *</Text>
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="Nhập giá bán"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Số lượng tồn kho *</Text>
          <TextInput
            style={styles.input}
            value={formData.stock}
            onChangeText={(text) => setFormData({ ...formData, stock: text })}
            placeholder="Nhập số lượng"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Text style={styles.saveButtonText}>Đang lưu...</Text>
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveButtonText}>Tạo sản phẩm</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessClose}
        title="Tạo thành công!"
        message="Sản phẩm mới đã được thêm vào kho"
      />
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#111827',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  pickerOptionActive: {
    backgroundColor: '#f0f9ff',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  pickerOptionTextActive: {
    color: '#175ead',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#175ead',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
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
})
