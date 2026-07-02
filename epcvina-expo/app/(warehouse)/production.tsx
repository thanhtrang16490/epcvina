import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
  Modal,
  Keyboard,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/contexts/AuthContext'
import { useFocusEffect } from 'expo-router'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import SuccessModal from '../../src/components/SuccessModal'
import type { Product } from '../../src/types'

type ProductionStatus = 'pending' | 'in_progress' | 'completed'
type StatusFilter = 'all' | ProductionStatus

interface ProductionRequest {
  id: string
  product_id: string
  quantity: number
  status: ProductionStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  products: {
    name: string
    code: string | null
  } | null
}

const STATUS_CONFIG: Record<ProductionStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ duyệt', color: '#f59e0b', bg: '#fef3c7' },
  in_progress: { label: 'Đang SX', color: '#2563eb', bg: '#dbeafe' },
  completed: { label: 'Hoàn thành', color: '#10b981', bg: '#d1fae5' },
}

export default function WarehouseProductionScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { contentPaddingBottom } = useTabBarHeight()

  const [requests, setRequests] = useState<ProductionRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<ProductionRequest[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Create form state
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const searchInputRef = useRef<TextInput>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  useEffect(() => {
    filterRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, statusFilter])

  // Debounced product search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase()
      if (!q) {
        setFilteredProducts([])
        setShowDropdown(false)
        return
      }
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code?.toLowerCase().includes(q)
      )
      setFilteredProducts(filtered)
      setShowDropdown(true)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery, products])

  const onRefresh = () => {
    setRefreshing(true)
    fetchData().finally(() => setRefreshing(false))
  }

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch production requests
      const { data, error } = await supabase
        .from('production_requests')
        .select('*, products(name, code)')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.message?.includes('does not exist')) {
          setRequests([])
          return
        }
        throw error
      }

      setRequests((data || []) as ProductionRequest[])

      // Fetch products for create form
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true })

      if (productsError) throw productsError
      setProducts(productsData || [])
    } catch (error) {
      console.error('Error fetching production data:', error)
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sản xuất')
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    if (statusFilter === 'all') {
      setFilteredRequests(requests)
    } else {
      setFilteredRequests(requests.filter((r) => r.status === statusFilter))
    }
  }

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setSearchQuery(product.name)
    setShowDropdown(false)
    Keyboard.dismiss()
  }

  const handleCreateRequest = async () => {
    if (!selectedProduct) {
      Alert.alert('Lỗi', 'Vui lòng chọn sản phẩm')
      return
    }

    const qty = parseInt(quantity)
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số lượng hợp lệ')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from('production_requests').insert({
        product_id: selectedProduct.id,
        quantity: qty,
        status: 'pending',
        notes: notes.trim() || null,
        created_by: user?.id,
      })

      if (error) {
        if (error.message?.includes('does not exist')) {
          Alert.alert('Lỗi', 'Bảng production_requests chưa tồn tại. Vui lòng liên hệ admin.')
          return
        }
        throw error
      }

      setSuccessMessage('Tạo yêu cầu sản xuất thành công!')
      setShowSuccessModal(true)
      resetForm()
      setShowCreateModal(false)
      fetchData()
    } catch (error) {
      console.error('Error creating production request:', error)
      Alert.alert('Lỗi', 'Không thể tạo yêu cầu sản xuất')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedProduct(null)
    setSearchQuery('')
    setQuantity('')
    setNotes('')
    setShowDropdown(false)
  }

  const handleUpdateStatus = async (
    requestId: string,
    newStatus: ProductionStatus
  ) => {
    const actionLabel =
      newStatus === 'in_progress' ? 'Bắt đầu sản xuất' : 'Hoàn thành'

    Alert.alert(
      'Xác nhận',
      `Bạn có chắc muốn ${actionLabel.toLowerCase()}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('production_requests')
                .update({
                  status: newStatus,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', requestId)

              if (error) throw error

              setSuccessMessage(`${actionLabel} thành công!`)
              setShowSuccessModal(true)
              fetchData()
            } catch (error) {
              console.error('Error updating status:', error)
              Alert.alert('Lỗi', 'Không thể cập nhật trạng thái')
            }
          },
        },
      ]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getNextAction = (status: ProductionStatus) => {
    if (status === 'pending') {
      return {
        label: 'Bắt đầu SX',
        nextStatus: 'in_progress' as ProductionStatus,
        color: '#2563eb',
        bg: '#dbeafe',
        icon: 'play' as const,
      }
    }
    if (status === 'in_progress') {
      return {
        label: 'Hoàn thành',
        nextStatus: 'completed' as ProductionStatus,
        color: '#10b981',
        bg: '#d1fae5',
        icon: 'checkmark' as const,
      }
    }
    return null
  }

  if (loading && requests.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.navHeaderCenter}>
          <Text style={styles.navHeaderTitle}>Sản xuất</Text>
          <Text style={styles.navHeaderSubtitle}>
            {filteredRequests.length} yêu cầu
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm()
            setShowCreateModal(true)
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Status Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {(
            [
              { key: 'all', label: 'Tất cả' },
              { key: 'pending', label: 'Chờ duyệt' },
              { key: 'in_progress', label: 'Đang SX' },
              { key: 'completed', label: 'Hoàn thành' },
            ] as { key: StatusFilter; label: string }[]
          ).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                statusFilter === tab.key && styles.tabActive,
              ]}
              onPress={() => setStatusFilter(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  statusFilter === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.content, { paddingBottom: contentPaddingBottom }]}>
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="construct-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Chưa có yêu cầu sản xuất</Text>
              <TouchableOpacity
                style={styles.emptyAction}
                onPress={() => {
                  resetForm()
                  setShowCreateModal(true)
                }}
              >
                <Text style={styles.emptyActionText}>
                  + Tạo yêu cầu mới
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredRequests.map((request) => {
              const status = STATUS_CONFIG[request.status]
              const nextAction = getNextAction(request.status)
              return (
                <View key={request.id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <View style={styles.requestLeft}>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: status.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: status.color },
                          ]}
                        >
                          {status.label}
                        </Text>
                      </View>
                      <Text style={styles.productName}>
                        {request.products?.name || 'Không xác định'}
                      </Text>
                      {request.products?.code && (
                        <Text style={styles.productCode}>
                          SKU: {request.products.code}
                        </Text>
                      )}
                    </View>
                    <View style={styles.requestRight}>
                      <Text style={styles.quantityLabel}>Số lượng</Text>
                      <Text style={styles.quantityValue}>
                        {request.quantity}
                      </Text>
                    </View>
                  </View>

                  {request.notes && (
                    <View style={styles.noteRow}>
                      <Ionicons
                        name="document-text"
                        size={14}
                        color="#9ca3af"
                      />
                      <Text style={styles.noteText}>{request.notes}</Text>
                    </View>
                  )}

                  <View style={styles.requestFooter}>
                    <View style={styles.footerItem}>
                      <Ionicons
                        name="calendar"
                        size={14}
                        color="#9ca3af"
                      />
                      <Text style={styles.footerText}>
                        {formatDate(request.created_at)}
                      </Text>
                    </View>
                    {nextAction && (
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: nextAction.bg },
                        ]}
                        onPress={() =>
                          handleUpdateStatus(request.id, nextAction.nextStatus)
                        }
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={nextAction.icon}
                          size={14}
                          color={nextAction.color}
                        />
                        <Text
                          style={[
                            styles.actionButtonText,
                            { color: nextAction.color },
                          ]}
                        >
                          {nextAction.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )
            })
          )}
        </View>
      </ScrollView>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo yêu cầu sản xuất</Text>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Product Search */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Sản phẩm</Text>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#9ca3af" />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder="Tìm tên hoặc mã sản phẩm..."
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text)
                    if (!text) setSelectedProduct(null)
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) setShowDropdown(true)
                  }}
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery('')
                      setSelectedProduct(null)
                      setShowDropdown(false)
                    }}
                  >
                    <Ionicons name="close-circle" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Dropdown */}
              {showDropdown && searchQuery.trim() && (
                <View style={styles.dropdown}>
                  {filteredProducts.length === 0 ? (
                    <View style={styles.dropdownEmpty}>
                      <Text style={styles.dropdownEmptyText}>
                        Không tìm thấy sản phẩm
                      </Text>
                    </View>
                  ) : (
                    filteredProducts.slice(0, 8).map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        style={styles.dropdownItem}
                        onPress={() => handleSelectProduct(p)}
                        activeOpacity={0.6}
                      >
                        <View style={styles.dropdownItemLeft}>
                          <Text
                            style={styles.dropdownItemName}
                            numberOfLines={1}
                          >
                            {p.name}
                          </Text>
                          {p.code && (
                            <Text style={styles.dropdownItemCode}>
                              SKU: {p.code}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.dropdownItemStock}>
                          Tồn: {p.stock} {p.unit || 'cái'}
                        </Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>

            {/* Quantity */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Số lượng cần sản xuất</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="Nhập số lượng"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Ghi chú (tuỳ chọn)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Lý do, ghi chú..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                submitting && styles.submitButtonDisabled,
              ]}
              onPress={handleCreateRequest}
              disabled={submitting}
              activeOpacity={0.7}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons
                    name="add-circle"
                    size={20}
                    color="white"
                  />
                  <Text style={styles.submitButtonText}>
                    Tạo yêu cầu
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thành công!"
        message={successMessage}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fffbeb',
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  navHeaderCenter: {
    flex: 1,
  },
  navHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  navHeaderSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f59e0b',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    backgroundColor: '#fffbeb',
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
    paddingVertical: 10,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  tabTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  emptyAction: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  requestLeft: {
    flex: 1,
    marginRight: 12,
    gap: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  productCode: {
    fontSize: 12,
    color: '#9ca3af',
  },
  requestRight: {
    alignItems: 'center',
    minWidth: 60,
  },
  quantityLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginBottom: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 2,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownEmpty: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  dropdownEmptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dropdownItemCode: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  dropdownItemStock: {
    fontSize: 12,
    color: '#6b7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    minHeight: 72,
    paddingTop: 10,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
