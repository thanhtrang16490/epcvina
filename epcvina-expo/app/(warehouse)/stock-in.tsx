import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  Keyboard,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/contexts/AuthContext'
import { useFocusEffect } from 'expo-router'
import SuccessModal from '../../src/components/SuccessModal'
import type { Product } from '../../src/types'

interface CartItem {
  product: Product
  quantity: number
}

export default function WarehouseStockInScreen() {
  const router = useRouter()
  const { user } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const searchInputRef = useRef<TextInput>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, [])
  )

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
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

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id)
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setSearchQuery('')
    setShowDropdown(false)
    searchInputRef.current?.focus()
  }

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleSetQty = (productId: string, value: string) => {
    const qty = parseInt(value)
    if (isNaN(qty) || qty <= 0) return
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const handleSubmit = async () => {
    if (cart.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm ít nhất một sản phẩm')
      return
    }
    const invalid = cart.find((item) => item.quantity <= 0)
    if (invalid) {
      Alert.alert('Lỗi', `Số lượng không hợp lệ cho: ${invalid.product.name}`)
      return
    }

    setSubmitting(true)
    try {
      const movements = cart.map((item) => ({
        product_id: item.product.id,
        type: 'in' as const,
        quantity: item.quantity,
        note: note.trim() || null,
        created_by: user?.id,
      }))

      const { error } = await supabase.from('stock_movements').insert(movements)

      if (error) throw error

      const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
      setSuccessMessage(
        `Nhập kho thành công! ${cart.length} sản phẩm, ${totalItems} đơn vị`
      )
      setShowSuccessModal(true)
      setCart([])
      setNote('')
      fetchProducts()
    } catch (error) {
      console.error('Error submitting stock in:', error)
      Alert.alert('Lỗi', 'Không thể xác nhận nhập kho. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with back button */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.navHeaderCenter}>
          <Text style={styles.navHeaderTitle}>Nhập kho</Text>
          <Text style={styles.navHeaderSubtitle}>
            Thêm nhiều sản phẩm rồi xác nhận một lần
          </Text>
        </View>
        <View style={styles.navHeaderIcon}>
          <Ionicons name="download" size={22} color="#f59e0b" />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Product Search */}
          <View style={styles.searchCard}>
            <Text style={styles.sectionLabel}>Tìm và thêm sản phẩm</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Tìm tên hoặc mã sản phẩm..."
                value={searchQuery}
                onChangeText={setSearchQuery}
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
                    setShowDropdown(false)
                  }}
                >
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>

            {/* Search results dropdown */}
            {showDropdown && searchQuery.trim() && (
              <View style={styles.dropdown}>
                {filteredProducts.length === 0 ? (
                  <View style={styles.dropdownEmpty}>
                    <Text style={styles.dropdownEmptyText}>
                      Không tìm thấy sản phẩm
                    </Text>
                  </View>
                ) : (
                  filteredProducts.slice(0, 10).map((p) => {
                    const inCart = cart.find((c) => c.product.id === p.id)
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={styles.dropdownItem}
                        onPress={() => handleAddToCart(p)}
                        activeOpacity={0.6}
                      >
                        <View style={styles.dropdownItemLeft}>
                          <Text style={styles.dropdownItemName} numberOfLines={1}>
                            {p.name}
                          </Text>
                          {p.code ? (
                            <Text style={styles.dropdownItemCode}>
                              SKU: {p.code}
                            </Text>
                          ) : null}
                        </View>
                        <View style={styles.dropdownItemRight}>
                          <Text style={styles.dropdownItemStock}>
                            Tồn: {p.stock} {p.unit || 'cái'}
                          </Text>
                          {inCart && (
                            <View style={styles.inCartBadge}>
                              <Text style={styles.inCartBadgeText}>
                                +{inCart.quantity}
                              </Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    )
                  })
                )}
              </View>
            )}
          </View>

          {/* Cart */}
          {cart.length > 0 && (
            <View style={styles.cartCard}>
              <View style={styles.cartHeader}>
                <Text style={styles.cartHeaderTitle}>
                  Danh sách nhập ({cart.length} sản phẩm)
                </Text>
                <Text style={styles.cartHeaderCount}>
                  {totalItems} đơn vị
                </Text>
              </View>

              {cart.map((item) => (
                <View key={item.product.id} style={styles.cartItem}>
                  {/* Product info */}
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.cartItemStock}>
                      Tồn: {item.product.stock} {item.product.unit || 'cái'}
                    </Text>
                  </View>

                  {/* Quantity controls */}
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        handleUpdateQty(item.product.id, -1)
                      }
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyButtonText}>−</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.qtyInput}
                      value={String(item.quantity)}
                      onChangeText={(value) =>
                        handleSetQty(item.product.id, value)
                      }
                      keyboardType="numeric"
                      selectTextOnFocus
                    />
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        handleUpdateQty(item.product.id, 1)
                      }
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Remove */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.product.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* After-stock preview */}
              <View style={styles.afterStockPreview}>
                <Text style={styles.afterStockLabel}>Tồn sau nhập:</Text>
                <View style={styles.afterStockItems}>
                  {cart.map((item) => (
                    <Text key={item.product.id} style={styles.afterStockItem}>
                      {item.product.name.length > 20
                        ? item.product.name.substring(0, 20) + '…'
                        : item.product.name}
                      : {item.product.stock} →{' '}
                      {item.product.stock + item.quantity}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Note */}
          <View style={styles.noteCard}>
            <Text style={styles.sectionLabel}>
              Ghi chú chung (tuỳ chọn)
            </Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Nhà cung cấp, lô hàng, ghi chú..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (submitting || cart.length === 0) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting || cart.length === 0}
            activeOpacity={0.7}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color="white"
                />
                <Text style={styles.submitButtonText}>
                  Xác nhận nhập kho
                  {cart.length > 0 &&
                    ` (${cart.length} SP · ${totalItems} đơn vị)`}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Bottom spacer */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Dismiss dropdown overlay */}
      {showDropdown && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          onPress={() => {
            setShowDropdown(false)
            Keyboard.dismiss()
          }}
          activeOpacity={0}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Nhập kho thành công!"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
        primaryButton={{
          text: 'Tiếp tục nhập',
          onPress: () => {
            setShowSuccessModal(false)
            searchInputRef.current?.focus()
          },
        }}
        secondaryButton={{
          text: 'Quay lại',
          onPress: () => {
            setShowSuccessModal(false)
            router.back()
          },
        }}
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
  // Nav header
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
  navHeaderIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fef3c7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  // Search section
  searchCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 4,
  },
  // Dropdown
  dropdown: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 240,
    overflow: 'hidden',
  },
  dropdownEmpty: {
    paddingVertical: 24,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  dropdownItemRight: {
    alignItems: 'flex-end',
  },
  dropdownItemStock: {
    fontSize: 12,
    color: '#6b7280',
  },
  inCartBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#fef3c7',
    borderRadius: 10,
  },
  inCartBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#b45309',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Cart section
  cartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cartHeaderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  cartHeaderCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
    gap: 8,
  },
  cartItemInfo: {
    flex: 1,
    minWidth: 0,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  cartItemStock: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  qtyInput: {
    width: 48,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // After-stock preview
  afterStockPreview: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ecfdf5',
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
  },
  afterStockLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 4,
  },
  afterStockItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  afterStockItem: {
    fontSize: 12,
    color: '#059669',
  },
  // Note section
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noteInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 72,
  },
  // Submit button
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    paddingVertical: 16,
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
