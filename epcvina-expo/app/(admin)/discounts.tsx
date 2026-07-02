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
import type { DiscountPolicy } from '../../src/types'

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'active' | 'expired'

const DISCOUNT_TYPE_LABELS: Record<string, string> = {
  immediate: 'Trực tiếp',
  monthly: 'Hàng tháng',
  quarterly: 'Hàng quý',
  annual: 'Hàng năm',
  volume_exceed: 'Vượt số lượng',
  promotional: 'Khuyến mãi',
  other: 'Khác',
}

const VALUE_TYPE_LABELS: Record<string, string> = {
  percentage: '%',
  fixed: 'VND',
  gift: 'Quà tặng',
}

const APPLIES_TO_LABELS: Record<string, string> = {
  customer: 'Khách hàng',
  product: 'Sản phẩm',
  region: 'Vùng',
  all: 'Tất cả',
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DiscountsScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [policies, setPolicies] = useState<DiscountPolicy[]>([])
  const [filterTab, setFilterTab] = useState<FilterTab>('all')

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<DiscountPolicy | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    discount_type: 'promotional' as string,
    value_type: 'percentage' as string,
    value: '',
    applies_to: 'all' as string,
    min_volume: '',
    effective_from: '',
    effective_to: '',
    notes: '',
    is_active: true,
  })
  const [showTypePicker, setShowTypePicker] = useState(false)
  const [showValueTypePicker, setShowValueTypePicker] = useState(false)
  const [showAppliesPicker, setShowAppliesPicker] = useState(false)

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('discount_policies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPolicies((data as DiscountPolicy[]) || [])
    } catch (error) {
      console.error('Error fetching discounts:', error)
      Alert.alert('Lỗi', 'Không thể tải chính sách chiết khấu')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchPolicies()
  }, [])

  // ─── Status helpers ─────────────────────────────────────────────────────

  const getPolicyStatus = (policy: DiscountPolicy): 'active' | 'expired' | 'scheduled' => {
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
      name: '',
      discount_type: 'promotional',
      value_type: 'percentage',
      value: '',
      applies_to: 'all',
      min_volume: '',
      effective_from: '',
      effective_to: '',
      notes: '',
      is_active: true,
    })
    setShowTypePicker(false)
    setShowValueTypePicker(false)
    setShowAppliesPicker(false)
    setModalVisible(true)
  }

  const openEditModal = (policy: DiscountPolicy) => {
    setEditingPolicy(policy)
    setForm({
      name: policy.name,
      discount_type: policy.discount_type || 'promotional',
      value_type: (policy as any).value_type || 'percentage',
      value: String((policy as any).value ?? policy.discount_value ?? ''),
      applies_to: (policy as any).applies_to || 'all',
      min_volume: (policy as any).min_volume?.toString() || '',
      effective_from: policy.effective_from || '',
      effective_to: policy.effective_to || '',
      notes: policy.notes || '',
      is_active: policy.is_active,
    })
    setShowTypePicker(false)
    setShowValueTypePicker(false)
    setShowAppliesPicker(false)
    setModalVisible(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên chính sách')
      return
    }

    try {
      setSaving(true)

      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        discount_type: form.discount_type,
        value_type: form.value_type,
        value: parseFloat(form.value) || 0,
        applies_to: form.applies_to,
        min_volume: form.min_volume ? parseFloat(form.min_volume) : null,
        effective_from: form.effective_from || null,
        effective_to: form.effective_to || null,
        notes: form.notes.trim() || null,
        is_active: form.is_active,
      }

      if (editingPolicy) {
        const { error } = await supabase.from('discount_policies').update(payload).eq('id', editingPolicy.id)
        if (error) throw error
        Alert.alert('Thành công', 'Cập nhật chính sách thành công')
      } else {
        const { error } = await supabase.from('discount_policies').insert(payload)
        if (error) throw error
        Alert.alert('Thành công', 'Tạo chính sách thành công')
      }

      setModalVisible(false)
      fetchPolicies()
    } catch (error: unknown) {
      console.error('Error saving discount policy:', error)
      const msg = error instanceof Error ? error.message : 'Không thể lưu chính sách'
      Alert.alert('Lỗi', msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (policy: DiscountPolicy) => {
    Alert.alert('Xác nhận xóa', `Xóa chính sách "${policy.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('discount_policies').delete().eq('id', policy.id)
            if (error) throw error
            Alert.alert('Thành công', 'Đã xóa chính sách')
            fetchPolicies()
          } catch (error: unknown) {
            console.error('Error deleting discount policy:', error)
            Alert.alert('Lỗi', 'Không thể xóa chính sách')
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

  const formatDiscountValue = (policy: DiscountPolicy) => {
    const val = (policy as any).value ?? policy.discount_value ?? 0
    const vtype = (policy as any).value_type || 'percentage'
    if (vtype === 'percentage') return `${val}%`
    return formatVND(val)
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
        <Text style={styles.headerTitle}>Chiết khấu</Text>
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
            <Ionicons name="pricetag-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Không tìm thấy chính sách</Text>
            <Text style={styles.emptySubtitle}>Tạo chính sách chiết khấu mới</Text>
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
                    <Text style={styles.cardName}>{policy.name}</Text>
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
                  <View style={styles.detailRow}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>
                        {DISCOUNT_TYPE_LABELS[policy.discount_type] || policy.discount_type}
                      </Text>
                    </View>
                    <Text style={styles.discountValue}>{formatDiscountValue(policy)}</Text>
                  </View>
                  {(policy as any).applies_to && (
                    <View style={styles.detailRow}>
                      <Ionicons name="locate-outline" size={14} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {APPLIES_TO_LABELS[(policy as any).applies_to] || (policy as any).applies_to}
                      </Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {formatDate(policy.effective_from)} — {formatDate(policy.effective_to)}
                    </Text>
                  </View>
                  {(policy as any).min_volume && (
                    <View style={styles.detailRow}>
                      <Ionicons name="bar-chart-outline" size={14} color="#6b7280" />
                      <Text style={styles.detailText}>Min: {(policy as any).min_volume}</Text>
                    </View>
                  )}
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
              {/* Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Tên chính sách <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={(t) => setForm({ ...form, name: t })}
                  placeholder="Nhập tên chính sách"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Discount Type picker */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Loại chiết khấu</Text>
                <TouchableOpacity
                  style={styles.pickerTrigger}
                  onPress={() => setShowTypePicker(!showTypePicker)}
                >
                  <Text style={styles.pickerText}>
                    {DISCOUNT_TYPE_LABELS[form.discount_type] || form.discount_type}
                  </Text>
                  <Ionicons
                    name={showTypePicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {showTypePicker && (
                  <View style={styles.dropdownList}>
                    {Object.entries(DISCOUNT_TYPE_LABELS).map(([key, label]) => (
                      <TouchableOpacity
                        key={key}
                        style={[styles.dropdownItem, form.discount_type === key && styles.dropdownItemSelected]}
                        onPress={() => {
                          setForm({ ...form, discount_type: key })
                          setShowTypePicker(false)
                        }}
                      >
                        <Text style={styles.dropdownItemName}>{label}</Text>
                        {form.discount_type === key && (
                          <Ionicons name="checkmark" size={18} color="#ef4444" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Value Type picker */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Kiểu giá trị</Text>
                <TouchableOpacity
                  style={styles.pickerTrigger}
                  onPress={() => setShowValueTypePicker(!showValueTypePicker)}
                >
                  <Text style={styles.pickerText}>
                    {VALUE_TYPE_LABELS[form.value_type] || form.value_type}
                  </Text>
                  <Ionicons
                    name={showValueTypePicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {showValueTypePicker && (
                  <View style={styles.dropdownList}>
                    {Object.entries(VALUE_TYPE_LABELS).map(([key, label]) => (
                      <TouchableOpacity
                        key={key}
                        style={[styles.dropdownItem, form.value_type === key && styles.dropdownItemSelected]}
                        onPress={() => {
                          setForm({ ...form, value_type: key })
                          setShowValueTypePicker(false)
                        }}
                      >
                        <Text style={styles.dropdownItemName}>{label}</Text>
                        {form.value_type === key && (
                          <Ionicons name="checkmark" size={18} color="#ef4444" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Value */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Giá trị chiết khấu</Text>
                <TextInput
                  style={styles.input}
                  value={form.value}
                  onChangeText={(t) => setForm({ ...form, value: t })}
                  placeholder={form.value_type === 'percentage' ? 'Nhập % (ví dụ: 10)' : 'Nhập số tiền VND'}
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Applies To picker */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Áp dụng cho</Text>
                <TouchableOpacity
                  style={styles.pickerTrigger}
                  onPress={() => setShowAppliesPicker(!showAppliesPicker)}
                >
                  <Text style={styles.pickerText}>
                    {APPLIES_TO_LABELS[form.applies_to] || form.applies_to}
                  </Text>
                  <Ionicons
                    name={showAppliesPicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {showAppliesPicker && (
                  <View style={styles.dropdownList}>
                    {Object.entries(APPLIES_TO_LABELS).map(([key, label]) => (
                      <TouchableOpacity
                        key={key}
                        style={[styles.dropdownItem, form.applies_to === key && styles.dropdownItemSelected]}
                        onPress={() => {
                          setForm({ ...form, applies_to: key })
                          setShowAppliesPicker(false)
                        }}
                      >
                        <Text style={styles.dropdownItemName}>{label}</Text>
                        {form.applies_to === key && (
                          <Ionicons name="checkmark" size={18} color="#ef4444" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Min volume */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Số lượng tối thiểu</Text>
                <TextInput
                  style={styles.input}
                  value={form.min_volume}
                  onChangeText={(t) => setForm({ ...form, min_volume: t })}
                  placeholder="Để trống nếu không yêu cầu"
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
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#374151',
  },
  typeBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400e',
  },
  discountValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
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
    maxHeight: '90%',
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
