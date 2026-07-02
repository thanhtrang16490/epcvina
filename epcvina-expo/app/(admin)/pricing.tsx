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
import type { CustomerSpecialPrice, Product } from '../../src/types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductWithPrices extends Product {
  specialPrices?: CustomerSpecialPriceWithCustomer[]
}

interface CustomerSpecialPriceWithCustomer extends CustomerSpecialPrice {
  customers?: { id: string; name: string } | null
}

interface CustomerOption {
  id: string
  name: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PricingScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [products, setProducts] = useState<ProductWithPrices[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [specialPrices, setSpecialPrices] = useState<CustomerSpecialPriceWithCustomer[]>([])

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    customer_id: '',
    price_type: 'fixed' as 'fixed' | 'percentage',
    price_value: '',
    effective_from: '',
    effective_to: '',
    notes: '',
    is_active: true,
  })
  const [customerSearch, setCustomerSearch] = useState('')
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([])
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [showPriceTypePicker, setShowPriceTypePicker] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, code, price, unit, category_id')
        .is('deleted_at', null)
        .order('name')

      if (error) throw error
      setProducts((data as ProductWithPrices[]) || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      Alert.alert('Lỗi', 'Không thể tải sản phẩm')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchSpecialPrices = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_special_prices')
        .select('*, customers(id, name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSpecialPrices((data as CustomerSpecialPriceWithCustomer[]) || [])
    } catch (error) {
      console.error('Error fetching special prices:', error)
      Alert.alert('Lỗi', 'Không thể tải giá đặc biệt')
    }
  }

  const searchCustomers = async (query: string) => {
    try {
      let q = supabase.from('customers').select('id, name').order('name').limit(20)
      if (query.trim()) {
        q = q.ilike('name', `%${query.trim()}%`)
      }
      const { data } = await q
      setCustomerOptions((data as CustomerOption[]) || [])
      setShowCustomerDropdown(true)
    } catch (error) {
      console.error('Error searching customers:', error)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchProducts()
  }, [])

  // ─── Product selection ───────────────────────────────────────────────────

  const handleSelectProduct = (product: ProductWithPrices) => {
    if (selectedProductId === product.id) {
      setSelectedProductId(null)
      setSpecialPrices([])
    } else {
      setSelectedProductId(product.id)
      fetchSpecialPrices(product.id)
    }
  }

  // ─── CRUD for special prices ─────────────────────────────────────────────

  const openCreateModal = () => {
    setForm({
      customer_id: '',
      price_type: 'fixed',
      price_value: '',
      effective_from: '',
      effective_to: '',
      notes: '',
      is_active: true,
    })
    setCustomerSearch('')
    setCustomerOptions([])
    setShowCustomerDropdown(false)
    setShowPriceTypePicker(false)
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (!selectedProductId) return
    if (!form.customer_id) {
      Alert.alert('Lỗi', 'Vui lòng chọn khách hàng')
      return
    }
    if (!form.price_value) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá trị')
      return
    }

    try {
      setSaving(true)

      const payload: Record<string, unknown> = {
        product_id: selectedProductId,
        customer_id: form.customer_id,
        price_type: form.price_type,
        price_value: parseFloat(form.price_value) || 0,
        effective_from: form.effective_from || new Date().toISOString().split('T')[0],
        effective_to: form.effective_to || null,
        notes: form.notes.trim() || null,
        is_active: form.is_active,
      }

      const { error } = await supabase.from('customer_special_prices').insert(payload)
      if (error) throw error

      Alert.alert('Thành công', 'Tạo giá đặc biệt thành công')
      setModalVisible(false)
      fetchSpecialPrices(selectedProductId)
    } catch (error: unknown) {
      console.error('Error saving special price:', error)
      const msg = error instanceof Error ? error.message : 'Không thể lưu giá đặc biệt'
      Alert.alert('Lỗi', msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (sp: CustomerSpecialPriceWithCustomer) => {
    Alert.alert('Xác nhận xóa', 'Xóa giá đặc biệt này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('customer_special_prices').delete().eq('id', sp.id)
            if (error) throw error
            Alert.alert('Thành công', 'Đã xóa giá đặc biệt')
            if (selectedProductId) fetchSpecialPrices(selectedProductId)
          } catch (error: unknown) {
            console.error('Error deleting special price:', error)
            Alert.alert('Lỗi', 'Không thể xóa giá đặc biệt')
          }
        },
      },
    ])
  }

  // ─── Formatting ──────────────────────────────────────────────────────────

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('vi-VN')
  }

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

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giá đặc biệt</Text>
        {selectedProductId && (
          <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        )}
        {!selectedProductId && <View style={{ width: 36 }} />}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm sản phẩm..."
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Product list */}
        <Text style={styles.sectionTitle}>Chọn sản phẩm để xem giá đặc biệt</Text>

        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm</Text>
          </View>
        ) : (
          filtered.map((product) => {
            const isSelected = selectedProductId === product.id
            return (
              <TouchableOpacity
                key={product.id}
                style={[styles.productCard, isSelected && styles.productCardSelected]}
                onPress={() => handleSelectProduct(product)}
                activeOpacity={0.7}
              >
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  {product.code && <Text style={styles.productCode}>Mã: {product.code}</Text>}
                </View>
                <View style={styles.productRight}>
                  <Text style={styles.productPrice}>{formatVND(product.price)}</Text>
                  <Ionicons
                    name={isSelected ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={isSelected ? '#ef4444' : '#9ca3af'}
                  />
                </View>
              </TouchableOpacity>
            )
          })
        )}

        {/* Special prices for selected product */}
        {selectedProduct && (
          <View style={styles.specialPricesSection}>
            <View style={styles.specialHeader}>
              <Text style={styles.specialTitle}>
                Giá đặc biệt — {selectedProduct.name}
              </Text>
              <Text style={styles.basePrice}>
                Giá cơ bản: {formatVND(selectedProduct.price)}
              </Text>
            </View>

            {specialPrices.length === 0 ? (
              <View style={styles.noSpecialPrices}>
                <Ionicons name="pricetag-outline" size={32} color="#d1d5db" />
                <Text style={styles.noSpecialPricesText}>Chưa có giá đặc biệt</Text>
                <TouchableOpacity style={styles.addSpecialBtn} onPress={openCreateModal}>
                  <Ionicons name="add" size={16} color="white" />
                  <Text style={styles.addSpecialBtnText}>Thêm giá đặc biệt</Text>
                </TouchableOpacity>
              </View>
            ) : (
              specialPrices.map((sp) => (
                <View key={sp.id} style={styles.specialPriceCard}>
                  <View style={styles.spHeader}>
                    <Text style={styles.spCustomer}>
                      {sp.customers?.name || 'Khách hàng không xác định'}
                    </Text>
                    <View
                      style={[
                        styles.spBadge,
                        sp.is_active ? styles.spBadgeActive : styles.spBadgeInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.spBadgeText,
                          sp.is_active ? styles.spBadgeTextActive : styles.spBadgeTextInactive,
                        ]}
                      >
                        {sp.is_active ? 'Hoạt động' : 'Ngưng'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.spDetails}>
                    <View style={styles.spDetailRow}>
                      <Text style={styles.spLabel}>Loại:</Text>
                      <Text style={styles.spValue}>
                        {sp.price_type === 'fixed' ? 'Giá cố định' : 'Giảm %'}
                      </Text>
                    </View>
                    <View style={styles.spDetailRow}>
                      <Text style={styles.spLabel}>Giá trị:</Text>
                      <Text style={styles.spValueHighlight}>
                        {sp.price_type === 'fixed'
                          ? formatVND(sp.price_value)
                          : `${sp.price_value}%`}
                      </Text>
                    </View>
                    <View style={styles.spDetailRow}>
                      <Text style={styles.spLabel}>Hiệu lực:</Text>
                      <Text style={styles.spValue}>
                        {formatDate(sp.effective_from)} — {formatDate(sp.effective_to)}
                      </Text>
                    </View>
                    {sp.notes && (
                      <View style={styles.spDetailRow}>
                        <Text style={styles.spLabel}>Ghi chú:</Text>
                        <Text style={styles.spValue}>{sp.notes}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.spDeleteBtn}
                    onPress={() => handleDelete(sp)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#dc2626" />
                    <Text style={styles.spDeleteBtnText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* ─── Create Special Price Modal ───────────────────────────────────── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo giá đặc biệt</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Product info */}
              {selectedProduct && (
                <View style={styles.selectedProductInfo}>
                  <Text style={styles.selectedProductLabel}>Sản phẩm:</Text>
                  <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
                  <Text style={styles.selectedProductPrice}>Giá cơ bản: {formatVND(selectedProduct.price)}</Text>
                </View>
              )}

              {/* Customer search */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Khách hàng <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={customerSearch}
                  onChangeText={(t) => {
                    setCustomerSearch(t)
                    setForm({ ...form, customer_id: '' })
                    searchCustomers(t)
                  }}
                  placeholder="Tìm khách hàng..."
                  placeholderTextColor="#9ca3af"
                />
                {form.customer_id === '' && customerSearch.length > 0 && showCustomerDropdown && (
                  <View style={styles.dropdownList}>
                    {customerOptions.length === 0 ? (
                      <Text style={styles.noResults}>Không tìm thấy khách hàng</Text>
                    ) : (
                      customerOptions.map((c) => (
                        <TouchableOpacity
                          key={c.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setCustomerSearch(c.name)
                            setForm({ ...form, customer_id: c.id })
                            setShowCustomerDropdown(false)
                          }}
                        >
                          <Text style={styles.dropdownItemName}>{c.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
                {form.customer_id !== '' && (
                  <View style={styles.selectedChip}>
                    <Text style={styles.selectedChipText}>{customerSearch}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setCustomerSearch('')
                        setForm({ ...form, customer_id: '' })
                      }}
                    >
                      <Ionicons name="close-circle" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Price type picker */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Loại giá</Text>
                <TouchableOpacity
                  style={styles.pickerTrigger}
                  onPress={() => setShowPriceTypePicker(!showPriceTypePicker)}
                >
                  <Text style={styles.pickerText}>
                    {form.price_type === 'fixed' ? 'Giá cố định (VND)' : 'Giảm theo %'}
                  </Text>
                  <Ionicons
                    name={showPriceTypePicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {showPriceTypePicker && (
                  <View style={styles.dropdownList}>
                    <TouchableOpacity
                      style={[styles.dropdownItem, form.price_type === 'fixed' && styles.dropdownItemSelected]}
                      onPress={() => {
                        setForm({ ...form, price_type: 'fixed' })
                        setShowPriceTypePicker(false)
                      }}
                    >
                      <Text style={styles.dropdownItemName}>Giá cố định (VND)</Text>
                      {form.price_type === 'fixed' && <Ionicons name="checkmark" size={18} color="#ef4444" />}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.dropdownItem, form.price_type === 'percentage' && styles.dropdownItemSelected]}
                      onPress={() => {
                        setForm({ ...form, price_type: 'percentage' })
                        setShowPriceTypePicker(false)
                      }}
                    >
                      <Text style={styles.dropdownItemName}>Giảm theo %</Text>
                      {form.price_type === 'percentage' && <Ionicons name="checkmark" size={18} color="#ef4444" />}
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Value */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Giá trị</Text>
                <TextInput
                  style={styles.input}
                  value={form.price_value}
                  onChangeText={(t) => setForm({ ...form, price_value: t })}
                  placeholder={form.price_type === 'fixed' ? 'Nhập số tiền VND' : 'Nhập % giảm (ví dụ: 10)'}
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Date range */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Ngày bắt đầu</Text>
                <TextInput
                  style={styles.input}
                  value={form.effective_from}
                  onChangeText={(t) => setForm({ ...form, effective_from: t })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Ngày kết thúc</Text>
                <TextInput
                  style={styles.input}
                  value={form.effective_to}
                  onChangeText={(t) => setForm({ ...form, effective_to: t })}
                  placeholder="YYYY-MM-DD (để trống = vô hạn)"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Notes */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Ghi chú</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={form.notes}
                  onChangeText={(t) => setForm({ ...form, notes: t })}
                  placeholder="Ghi chú (tùy chọn)"
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
                  <Text style={styles.saveBtnText}>Tạo mới</Text>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
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
  // Product card
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
    padding: 16,
  },
  productCardSelected: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  productCode: {
    fontSize: 13,
    color: '#6b7280',
  },
  productRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  // Special prices section
  specialPricesSection: {
    marginTop: 16,
    gap: 12,
  },
  specialHeader: {
    gap: 4,
  },
  specialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  basePrice: {
    fontSize: 13,
    color: '#6b7280',
  },
  noSpecialPrices: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  noSpecialPricesText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  addSpecialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    marginTop: 4,
  },
  addSpecialBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  specialPriceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
    padding: 16,
    gap: 10,
  },
  spHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spCustomer: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  spBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  spBadgeActive: {
    backgroundColor: '#dcfce7',
  },
  spBadgeInactive: {
    backgroundColor: '#f3f4f6',
  },
  spBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  spBadgeTextActive: {
    color: '#16a34a',
  },
  spBadgeTextInactive: {
    color: '#6b7280',
  },
  spDetails: {
    gap: 4,
  },
  spDetailRow: {
    flexDirection: 'row',
    gap: 8,
  },
  spLabel: {
    fontSize: 13,
    color: '#6b7280',
    width: 70,
  },
  spValue: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  spValueHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
    flex: 1,
  },
  spDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  spDeleteBtnText: {
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
  selectedProductInfo: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 4,
  },
  selectedProductLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  selectedProductPrice: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
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
  noResults: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 20,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  selectedChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
    flex: 1,
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
