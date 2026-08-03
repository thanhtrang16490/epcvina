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
import type { Product, Category } from '../../src/types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductWithCategory extends Product {
  categories?: { id: number; name: string } | null
  is_active?: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProductsScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    code: '',
    price: '',
    unit: '',
    category_id: '',
    description: '',
    is_active: true,
  })
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*, categories(id, name)')
          .is('deleted_at', null)
          .order('name'),
        supabase.from('categories').select('*').order('name'),
      ])

      if (productsRes.error) throw productsRes.error
      if (categoriesRes.error) throw categoriesRes.error

      setProducts((productsRes.data as ProductWithCategory[]) || [])
      setCategories((categoriesRes.data as Category[]) || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      Alert.alert('Lỗi', 'Không thể tải sản phẩm')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [])

  // ─── CRUD ────────────────────────────────────────────────────────────────

  const openCreateModal = () => {
    setEditingProduct(null)
    setForm({ name: '', code: '', price: '', unit: '', category_id: '', description: '', is_active: true })
    setShowCategoryPicker(false)
    setModalVisible(true)
  }

  const openEditModal = (product: ProductWithCategory) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      code: product.code || '',
      price: product.price?.toString() || '',
      unit: product.unit || '',
      category_id: product.category_id?.toString() || '',
      description: product.description || '',
      is_active: (product as any).is_active !== false,
    })
    setShowCategoryPicker(false)
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm')
      return
    }

    try {
      setSaving(true)

      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        code: form.code.trim() || null,
        price: parseFloat(form.price) || 0,
        unit: form.unit.trim() || null,
        category_id: form.category_id || null,
        description: form.description.trim() || null,
        is_active: form.is_active,
      }

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id)
        if (error) throw error
        Alert.alert('Thành công', 'Cập nhật sản phẩm thành công')
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        Alert.alert('Thành công', 'Tạo sản phẩm thành công')
      }

      setModalVisible(false)
      fetchData()
    } catch (error: unknown) {
      console.error('Error saving product:', error)
      const msg = error instanceof Error ? error.message : 'Không thể lưu sản phẩm'
      Alert.alert('Lỗi', msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (product: ProductWithCategory) => {
    Alert.alert('Xác nhận xóa', `Xóa sản phẩm "${product.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('products')
              .update({ deleted_at: new Date().toISOString() })
              .eq('id', product.id)
            if (error) throw error
            Alert.alert('Thành công', 'Đã xóa sản phẩm')
            fetchData()
          } catch (error: unknown) {
            console.error('Error deleting product:', error)
            Alert.alert('Lỗi', 'Không thể xóa sản phẩm')
          }
        },
      },
    ])
  }

  // ─── Formatting ──────────────────────────────────────────────────────────

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  // ─── Filter ──────────────────────────────────────────────────────────────

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <Text style={styles.headerTitle}>Sản phẩm</Text>
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
            <Ionicons name="cube-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm</Text>
            <Text style={styles.emptySubtitle}>Tạo sản phẩm mới để bắt đầu</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openCreateModal}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.emptyButtonText}>Tạo sản phẩm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((product) => (
            <View key={product.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{product.name}</Text>
                  {product.code ? <Text style={styles.cardCode}>Mã: {product.code}</Text> : null}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    (product as any).is_active !== false ? styles.badgeActive : styles.badgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      (product as any).is_active !== false ? styles.badgeTextActive : styles.badgeTextInactive,
                    ]}
                  >
                    {(product as any).is_active !== false ? 'Hoạt động' : 'Ngưng'}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="pricetag" size={14} color="#ef4444" />
                  <Text style={styles.detailText}>{formatVND(product.price)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cube-outline" size={14} color="#6b7280" />
                  <Text style={styles.detailText}>Tồn kho: {product.stock ?? 0}</Text>
                </View>
                {product.categories && (
                  <View style={styles.detailRow}>
                    <Ionicons name="folder-outline" size={14} color="#6b7280" />
                    <Text style={styles.detailText}>{product.categories.name}</Text>
                  </View>
                )}
                {product.unit && (
                  <View style={styles.detailRow}>
                    <Ionicons name="scale-outline" size={14} color="#6b7280" />
                    <Text style={styles.detailText}>ĐVT: {product.unit}</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openEditModal(product)}
                >
                  <Ionicons name="create-outline" size={18} color="#ef4444" />
                  <Text style={styles.editBtnText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(product)}
                >
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
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Tên sản phẩm <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={(t) => setForm({ ...form, name: t })}
                  placeholder="Nhập tên sản phẩm"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Code */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mã sản phẩm</Text>
                <TextInput
                  style={styles.input}
                  value={form.code}
                  onChangeText={(t) => setForm({ ...form, code: t })}
                  placeholder="Nhập mã (tùy chọn)"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="characters"
                />
              </View>

              {/* Price */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Giá (VND)</Text>
                <TextInput
                  style={styles.input}
                  value={form.price}
                  onChangeText={(t) => setForm({ ...form, price: t })}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Unit */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Đơn vị tính</Text>
                <TextInput
                  style={styles.input}
                  value={form.unit}
                  onChangeText={(t) => setForm({ ...form, unit: t })}
                  placeholder="ví dụ: bao, kg, lít..."
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Category picker */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Danh mục</Text>
                <TouchableOpacity
                  style={styles.pickerTrigger}
                  onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                >
                  <Text style={styles.pickerText}>
                    {form.category_id
                      ? categories.find((c) => c.id.toString() === form.category_id)?.name || 'Chọn danh mục'
                      : 'Chọn danh mục'}
                  </Text>
                  <Ionicons
                    name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {showCategoryPicker && (
                  <View style={styles.dropdownList}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setForm({ ...form, category_id: '' })
                        setShowCategoryPicker(false)
                      }}
                    >
                      <Text style={styles.dropdownItemName}>— Không chọn —</Text>
                    </TouchableOpacity>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.dropdownItem,
                          form.category_id === cat.id.toString() && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setForm({ ...form, category_id: cat.id.toString() })
                          setShowCategoryPicker(false)
                        }}
                      >
                        <Text style={styles.dropdownItemName}>{cat.name}</Text>
                        {form.category_id === cat.id.toString() && (
                          <Ionicons name="checkmark" size={18} color="#ef4444" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={form.description}
                  onChangeText={(t) => setForm({ ...form, description: t })}
                  placeholder="Mô tả sản phẩm (tùy chọn)"
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
                  <Text style={styles.saveBtnText}>{editingProduct ? 'Cập nhật' : 'Tạo mới'}</Text>
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
    gap: 12,
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
  cardDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#374151',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
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
    maxHeight: '85%',
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
  pickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    maxHeight: 160,
    marginTop: 4,
    backgroundColor: 'white',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemSelected: {
    backgroundColor: '#fef2f2',
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
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
