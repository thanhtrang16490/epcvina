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
import type { GiftPolicy } from '../../src/types'

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'active' | 'expired'

interface ProductOption {
  id: number
  name: string
  code: string | null
  price: number
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function GiftsScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [policies, setPolicies] = useState<GiftPolicy[]>([])
  const [filterTab, setFilterTab] = useState<FilterTab>('all')

  // Product search for modal
  const [productOptions, setProductOptions] = useState<ProductOption[]>([])
  const [triggerSearch, setTriggerSearch] = useState('')
  const [giftSearch, setGiftSearch] = useState('')
  const [showTriggerDropdown, setShowTriggerDropdown] = useState(false)
  const [showGiftDropdown, setShowGiftDropdown] = useState(false)

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<GiftPolicy | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    trigger_product_id: '' as string,
    min_quantity: '',
    gift_product_id: '' as string,
    gift_quantity: '1',
    effective_from: '',
    effective_to: '',
    is_active: true,
  })

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_policies')
        .select('*, trigger_product:products!gift_policies_trigger_product_id_fkey(id, name, code), gift_product:products!gift_policies_gift_product_id_fkey(id, name, code, price, unit)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPolicies((data as GiftPolicy[]) || [])
    } catch (error) {
      console.error('Error fetching gift policies:', error)
      Alert.alert('Lỗi', 'Không thể tải chính sách tặng quà')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchPolicies()
  }, [])

  // ─── Product search ──────────────────────────────────────────────────────

  const searchProducts = async (query: string, type: 'trigger' | 'gift') => {
    try {
      let q = supabase.from('products').select('id, name, code, price').is('deleted_at', null).order('name').limit(20)
      if (query.trim()) {
        q = q.or(`name.ilike.%${query.trim()}%,code.ilike.%${query.trim()}%`)
      }
      const { data } = await q
      setProductOptions((data as ProductOption[]) || [])
      if (type === 'trigger') setShowTriggerDropdown(true)
      else setShowGiftDropdown(true)
    } catch (error) {
      console.error('Error searching products:', error)
    }
  }

  // ─── Status helpers ─────────────────────────────────────────────────────

  const getPolicyStatus = (policy: GiftPolicy): 'active' | 'expired' | 'scheduled' => {
    if (!policy.is_active) return 'expired'
    const now = new Date()
    if (policy.effective_from && new Date(policy.effective_from) > now) return 'scheduled'
    if (policy.effective_to && new Date(policy.effective_to) < now) return 'expired'
    return 'active'
  }

  // ─── Filter ──────────────────────────────────────────────────────────────

  const filtered = policies.filter((p) => {
    const status = getPolicyStatus(p)
    if (filterTab === 'active') return status === 'active' || status === 'scheduled'
    if (filterTab === 'expired') return status === 'expired'
    return true
  })

  // ─── CRUD ────────────────────────────────────────────────────────────────

  const openCreateModal = () => {
    setEditingPolicy(null)
    setForm({
      trigger_product_id: '',
      min_quantity: '',
      gift_product_id: '',
      gift_quantity: '1',
      effective_from: '',
      effective_to: '',
      is_active: true,
    })
    setTriggerSearch('')
    setGiftSearch('')
    setProductOptions([])
    setShowTriggerDropdown(false)
    setShowGiftDropdown(false)
    setModalVisible(true)
  }

  const openEditModal = (policy: GiftPolicy) => {
    setEditingPolicy(policy)
    setForm({
      trigger_product_id: policy.trigger_product_id?.toString() || '',
      min_quantity: policy.min_quantity?.toString() || '',
      gift_product_id: policy.gift_product_id?.toString() || '',
      gift_quantity: policy.gift_quantity?.toString() || '1',
      effective_from: policy.effective_from || '',
      effective_to: policy.effective_to || '',
      is_active: policy.is_active,
    })
    setTriggerSearch(policy.trigger_product?.name || '')
    setGiftSearch(policy.gift_product?.name || '')
    setProductOptions([])
    setShowTriggerDropdown(false)
    setShowGiftDropdown(false)
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (!form.trigger_product_id) {
      Alert.alert('Lỗi', 'Vui lòng chọn sản phẩm mua')
      return
    }
    if (!form.gift_product_id) {
      Alert.alert('Lỗi', 'Vui lòng chọn sản phẩm tặng')
      return
    }

    try {
      setSaving(true)

      const payload: Record<string, unknown> = {
        trigger_product_id: parseInt(form.trigger_product_id) || null,
        min_quantity: form.min_quantity ? parseInt(form.min_quantity) : null,
        gift_product_id: parseInt(form.gift_product_id) || null,
        gift_quantity: parseInt(form.gift_quantity) || 1,
        effective_from: form.effective_from || null,
        effective_to: form.effective_to || null,
        is_active: form.is_active,
      }

      if (editingPolicy) {
        const { error } = await supabase.from('gift_policies').update(payload).eq('id', editingPolicy.id)
        if (error) throw error
        Alert.alert('Thành công', 'Cập nhật chính sách thành công')
      } else {
        const { error } = await supabase.from('gift_policies').insert(payload)
        if (error) throw error
        Alert.alert('Thành công', 'Tạo chính sách thành công')
      }

      setModalVisible(false)
      fetchPolicies()
    } catch (error: unknown) {
      console.error('Error saving gift policy:', error)
      const msg = error instanceof Error ? error.message : 'Không thể lưu chính sách'
      Alert.alert('Lỗi', msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (policy: GiftPolicy) => {
    Alert.alert('Xác nhận xóa', 'Xóa chính sách tặng quà này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('gift_policies').delete().eq('id', policy.id)
            if (error) throw error
            Alert.alert('Thành công', 'Đã xóa chính sách')
            fetchPolicies()
          } catch (error: unknown) {
            console.error('Error deleting gift policy:', error)
            Alert.alert('Lỗi', 'Không thể xóa chính sách')
          }
        },
      },
    ])
  }

  // ─── Formatting ──────────────────────────────────────────────────────────

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('vi-VN')
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'active', label: 'Đang áp dụng' },
    { key: 'expired', label: 'Hết hạn' },
  ]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tặng quà</Text>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, filterTab === tab.key && styles.tabActive]}
            onPress={() => setFilterTab(tab.key)}
          >
            <Text style={[styles.tabText, filterTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="gift-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Không tìm thấy chính sách</Text>
            <Text style={styles.emptySubtitle}>Tạo chính sách tặng quà mới</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={openCreateModal}>
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.emptyButtonText}>Tạo chính sách</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((policy) => {
            const status = getPolicyStatus(policy)
            return (
              <View key={policy.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>
                      Mua {policy.trigger_product?.name || '?'} tặng {policy.gift_product?.name || '?'}
                    </Text>
                    {policy.min_quantity && (
                      <Text style={styles.cardSubtext}>
                        Tối thiểu {policy.min_quantity} sản phẩm
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      status === 'active' && styles.badgeActive,
                      status === 'expired' && styles.badgeInactive,
                      status === 'scheduled' && styles.badgeScheduled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        status === 'active' && styles.badgeTextActive,
                        status === 'expired' && styles.badgeTextInactive,
                        status === 'scheduled' && styles.badgeTextScheduled,
                      ]}
                    >
                      {status === 'active' ? 'Đang áp dụng' : status === 'scheduled' ? 'Sắp áp dụng' : 'Hết hạn'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.giftSummary}>
                    <View style={styles.productTag}>
                      <Ionicons name="cart-outline" size={12} color="#6b7280" />
                      <Text style={styles.productTagText}>
                        {policy.trigger_product?.name || '?'}
                        {policy.trigger_product?.code ? ` (${policy.trigger_product.code})` : ''}
                      </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={16} color="#ef4444" />
                    <View style={[styles.productTag, styles.productTagGift]}>
                      <Ionicons name="gift-outline" size={12} color="#ef4444" />
                      <Text style={[styles.productTagText, styles.productTagGiftText]}>
                        {policy.gift_product?.name || '?'} x{policy.gift_quantity || 1}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {formatDate(policy.effective_from)} — {formatDate(policy.effective_to)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(policy)}>
                    <Ionicons name="create-outline" size={18} color="#ef4444" />
                    <Text style={styles.editBtnText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(policy)}>
                    <Ionicons name="trash-outline" size={18} color="#dc2626" />
                    <Text style={styles.deleteBtnText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          })
        )}
      </ScrollView>

      {/* ─── Create / Edit Modal ─────────────────────────────────────────── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPolicy ? 'Chỉnh sửa chính sách' : 'Tạo chính sách mới'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Trigger Product search */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Sản phẩm mua <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={triggerSearch}
                  onChangeText={(t) => {
                    setTriggerSearch(t)
                    setForm({ ...form, trigger_product_id: '' })
                    searchProducts(t, 'trigger')
                  }}
                  placeholder="Tìm sản phẩm mua..."
                  placeholderTextColor="#9ca3af"
                />
                {form.trigger_product_id === '' && triggerSearch.length > 0 && showTriggerDropdown && (
                  <View style={styles.dropdownList}>
                    {productOptions.length === 0 ? (
                      <Text style={styles.noResults}>Không tìm thấy sản phẩm</Text>
                    ) : (
                      productOptions.map((p) => (
                        <TouchableOpacity
                          key={p.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setTriggerSearch(p.name)
                            setForm({ ...form, trigger_product_id: p.id.toString() })
                            setShowTriggerDropdown(false)
                          }}
                        >
                          <View>
                            <Text style={styles.dropdownItemName}>{p.name}</Text>
                            {p.code && <Text style={styles.dropdownItemSub}>{p.code}</Text>}
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
                {form.trigger_product_id !== '' && (
                  <View style={styles.selectedChip}>
                    <Text style={styles.selectedChipText}>{triggerSearch}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setTriggerSearch('')
                        setForm({ ...form, trigger_product_id: '' })
                      }}
                    >
                      <Ionicons name="close-circle" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Min quantity */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Số lượng tối thiểu</Text>
                <TextInput
                  style={styles.input}
                  value={form.min_quantity}
                  onChangeText={(t) => setForm({ ...form, min_quantity: t })}
                  placeholder="Để trống nếu không yêu cầu"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                />
              </View>

              {/* Gift Product search */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Sản phẩm tặng <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={giftSearch}
                  onChangeText={(t) => {
                    setGiftSearch(t)
                    setForm({ ...form, gift_product_id: '' })
                    searchProducts(t, 'gift')
                  }}
                  placeholder="Tìm sản phẩm tặng..."
                  placeholderTextColor="#9ca3af"
                />
                {form.gift_product_id === '' && giftSearch.length > 0 && showGiftDropdown && (
                  <View style={styles.dropdownList}>
                    {productOptions.length === 0 ? (
                      <Text style={styles.noResults}>Không tìm thấy sản phẩm</Text>
                    ) : (
                      productOptions.map((p) => (
                        <TouchableOpacity
                          key={p.id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setGiftSearch(p.name)
                            setForm({ ...form, gift_product_id: p.id.toString() })
                            setShowGiftDropdown(false)
                          }}
                        >
                          <View>
                            <Text style={styles.dropdownItemName}>{p.name}</Text>
                            {p.code && <Text style={styles.dropdownItemSub}>{p.code}</Text>}
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
                {form.gift_product_id !== '' && (
                  <View style={styles.selectedChip}>
                    <Text style={styles.selectedChipText}>{giftSearch}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setGiftSearch('')
                        setForm({ ...form, gift_product_id: '' })
                      }}
                    >
                      <Ionicons name="close-circle" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Gift quantity */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Số lượng tặng</Text>
                <TextInput
                  style={styles.input}
                  value={form.gift_quantity}
                  onChangeText={(t) => setForm({ ...form, gift_quantity: t })}
                  placeholder="1"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
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
                  <Text style={styles.saveBtnText}>{editingPolicy ? 'Cập nhật' : 'Tạo mới'}</Text>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#fee2e2',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#ef4444',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  cardSubtext: {
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
  badgeScheduled: {
    backgroundColor: '#dbeafe',
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
  badgeTextScheduled: {
    color: '#2563eb',
  },
  cardDetails: {
    gap: 6,
  },
  giftSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  productTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  productTagGift: {
    backgroundColor: '#fef2f2',
  },
  productTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  productTagGiftText: {
    color: '#ef4444',
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
  dropdownList: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    maxHeight: 160,
    marginTop: 4,
    backgroundColor: 'white',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  dropdownItemSub: {
    fontSize: 12,
    color: '#9ca3af',
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
