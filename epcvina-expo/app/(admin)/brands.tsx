import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
  Switch,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Brand {
  id: string
  code: string | null
  name: string
  description: string | null
  logo_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BrandsScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
  })

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name')

      if (error) throw error
      setBrands((data as Brand[]) || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
      Alert.alert('Lỗi', 'Không thể tải thương hiệu')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchBrands()
  }, [])

  // ─── CRUD ────────────────────────────────────────────────────────────────

  const openCreateModal = () => {
    setEditingBrand(null)
    setForm({ name: '', code: '', description: '', is_active: true })
    setModalVisible(true)
  }

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand)
    setForm({
      name: brand.name,
      code: brand.code || '',
      description: brand.description || '',
      is_active: brand.is_active,
    })
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thương hiệu')
      return
    }

    try {
      setSaving(true)

      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        code: form.code.trim() || null,
        description: form.description.trim() || null,
        is_active: form.is_active,
      }

      if (editingBrand) {
        const { error } = await supabase.from('brands').update(payload).eq('id', editingBrand.id)
        if (error) throw error
        Alert.alert('Thành công', 'Cập nhật thương hiệu thành công')
      } else {
        const { error } = await supabase.from('brands').insert(payload)
        if (error) throw error
        Alert.alert('Thành công', 'Tạo thương hiệu thành công')
      }

      setModalVisible(false)
      fetchBrands()
    } catch (error: unknown) {
      console.error('Error saving brand:', error)
      const msg = error instanceof Error ? error.message : 'Không thể lưu thương hiệu'
      Alert.alert('Lỗi', msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (brand: Brand) => {
    Alert.alert('Xác nhận xóa', `Xóa thương hiệu "${brand.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('brands').delete().eq('id', brand.id)
            if (error) throw error
            Alert.alert('Thành công', 'Đã xóa thương hiệu')
            fetchBrands()
          } catch (error: unknown) {
            console.error('Error deleting brand:', error)
            Alert.alert('Lỗi', 'Không thể xóa thương hiệu')
          }
        },
      },
    ])
  }

  // ─── Filter ──────────────────────────────────────────────────────────────

  const filtered = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.code && b.code.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // ─── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thương hiệu</Text>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên hoặc mã..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="shield-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Không tìm thấy thương hiệu</Text>
            <Text style={styles.emptySubtitle}>Tạo thương hiệu mới để bắt đầu</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openCreateModal}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.emptyButtonText}>Tạo thương hiệu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((brand) => (
            <View key={brand.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{brand.name}</Text>
                  {brand.code && <Text style={styles.cardCode}>Mã: {brand.code}</Text>}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    brand.is_active ? styles.badgeActive : styles.badgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      brand.is_active ? styles.badgeTextActive : styles.badgeTextInactive,
                    ]}
                  >
                    {brand.is_active ? 'Hoạt động' : 'Ngưng'}
                  </Text>
                </View>
              </View>

              {brand.description && (
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {brand.description}
                </Text>
              )}

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(brand)}>
                  <Ionicons name="create-outline" size={18} color="#ef4444" />
                  <Text style={styles.editBtnText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(brand)}>
                  <Ionicons name="trash-outline" size={18} color="#dc2626" />
                  <Text style={styles.deleteBtnText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ─── Create / Edit Modal ─────────────────────────────────────────── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBrand ? 'Chỉnh sửa thương hiệu' : 'Tạo thương hiệu mới'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Tên thương hiệu <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={(t) => setForm({ ...form, name: t })}
                  placeholder="Nhập tên thương hiệu"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Code */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mã thương hiệu</Text>
                <TextInput
                  style={styles.input}
                  value={form.code}
                  onChangeText={(t) => setForm({ ...form, code: t })}
                  placeholder="Nhập mã (tùy chọn)"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="characters"
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={form.description}
                  onChangeText={(t) => setForm({ ...form, description: t })}
                  placeholder="Mô tả thương hiệu (tùy chọn)"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Active toggle */}
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Trạng thái hoạt động</Text>
                <Switch
                  value={form.is_active}
                  onValueChange={(v) => setForm({ ...form, is_active: v })}
                  trackColor={{ false: '#d1d5db', true: '#fca5a5' }}
                  thumbColor={form.is_active ? '#ef4444' : '#f3f4f6'}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>{editingBrand ? 'Cập nhật' : 'Tạo mới'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef2f2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 14,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardCode: {
    fontSize: 13,
    color: '#6b7280',
  },
  cardDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeActive: {
    backgroundColor: '#dcfce7',
  },
  badgeInactive: {
    backgroundColor: '#f3f4f6',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: '#16a34a',
  },
  badgeTextInactive: {
    color: '#6b7280',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ef4444',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#dc2626',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
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
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#ef4444',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
