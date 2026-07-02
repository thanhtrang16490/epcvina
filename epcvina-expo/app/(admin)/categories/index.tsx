import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function CategoriesScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    checkAccess()
    fetchCategories()
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

    if (!profile || !['admin', 'sale_admin'].includes(profile.role)) {
      router.replace('/(sales)/dashboard')
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      Alert.alert('Lỗi', 'Không thể tải danh mục')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục')
      return
    }

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description
          })
          .eq('id', editingCategory.id)

        if (error) throw error
        Alert.alert('Thành công', 'Cập nhật danh mục thành công')
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description
          })

        if (error) throw error
        Alert.alert('Thành công', 'Tạo danh mục thành công')
      }

      setModalVisible(false)
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
      fetchCategories()
    } catch (error: any) {
      console.error('Error saving category:', error)
      Alert.alert('Lỗi', error.message || 'Không thể lưu danh mục')
    }
  }

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa danh mục này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id)

              if (error) throw error
              Alert.alert('Thành công', 'Xóa danh mục thành công')
              fetchCategories()
            } catch (error: any) {
              console.error('Error deleting category:', error)
              Alert.alert('Lỗi', error.message || 'Không thể xóa danh mục')
            }
          }
        }
      ]
    )
  }

  const openEditModal = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ''
    })
    setModalVisible(true)
  }

  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
    setModalVisible(true)
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <Text style={styles.headerTitle}>Quản lý danh mục</Text>
        <TouchableOpacity onPress={openCreateModal} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#175ead" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm danh mục..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredCategories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              {category.description && (
                <Text style={styles.categoryDescription}>{category.description}</Text>
              )}
            </View>
            <View style={styles.categoryActions}>
              <TouchableOpacity
                onPress={() => openEditModal(category)}
                style={styles.actionButton}
              >
                <Ionicons name="create-outline" size={20} color="#175ead" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(category.id)}
                style={styles.actionButton}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredCategories.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyStateText}>Không tìm thấy danh mục</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'Sửa danh mục' : 'Tạo danh mục mới'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên danh mục *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên danh mục"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập mô tả (tùy chọn)"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonSecondaryText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSave}
              >
                <Text style={styles.buttonPrimaryText}>
                  {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                </Text>
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
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
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
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  formGroup: {
    marginBottom: 20,
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
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#f3f4f6',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  buttonPrimary: {
    backgroundColor: '#175ead',
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
