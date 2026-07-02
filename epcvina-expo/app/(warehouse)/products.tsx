import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, TextInput, Alert, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'
import SuccessModal from '../../src/components/SuccessModal'

export default function WarehouseProductsScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { contentPaddingBottom } = useTabBarHeight()
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'low'>('all')
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [newStock, setNewStock] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    fetchProducts()
    if (params.filter === 'low') {
      setFilterType('low')
    }
  }, [params.filter])

  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, filterType])

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, [])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchProducts().finally(() => setRefreshing(false))
  }

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

  const filterProducts = () => {
    let filtered = products

    // Filter by stock level
    if (filterType === 'low') {
      filtered = filtered.filter(p => p.stock < 20)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const handleEditStock = (product: any) => {
    setEditingProduct(product)
    setNewStock(product.stock.toString())
  }

  const handleSaveStock = async () => {
    if (!editingProduct) return

    const stockValue = parseInt(newStock)
    if (isNaN(stockValue) || stockValue < 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số lượng hợp lệ')
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock: stockValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProduct.id)

      if (error) throw error

      setShowSuccessModal(true)
      setEditingProduct(null)
      setNewStock('')
      fetchProducts()
    } catch (error) {
      console.error('Error updating stock:', error)
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng tồn')
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Hết hàng', color: '#dc2626', bg: '#fee2e2' }
    if (stock < 20) return { label: 'Sắp hết', color: '#f59e0b', bg: '#fef3c7' }
    return { label: 'Còn hàng', color: '#10b981', bg: '#d1fae5' }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' VNĐ'
  }

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
      <AppHeader />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Sản phẩm</Text>
            <Text style={styles.headerSubtitle}>
              {filteredProducts.length} sản phẩm
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="pricetags" size={24} color="#f59e0b" />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, filterType === 'all' && styles.filterTabActive]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[styles.filterTabText, filterType === 'all' && styles.filterTabTextActive]}>
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filterType === 'low' && styles.filterTabActive]}
            onPress={() => setFilterType('low')}
          >
            <Text style={[styles.filterTabText, filterType === 'low' && styles.filterTabTextActive]}>
              Sắp hết
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.content, { paddingBottom: contentPaddingBottom }]}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="pricetags-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
            </View>
          ) : (
            filteredProducts.map((product) => {
              const status = getStockStatus(product.stock)
              return (
                <View key={product.id} style={styles.productCard}>
                  <View style={styles.productHeader}>
                    <View style={styles.productLeft}>
                      <View style={styles.productIcon}>
                        <Ionicons name="cube" size={20} color="#f59e0b" />
                      </View>
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>{product.name}</Text>
                        {product.sku && (
                          <Text style={styles.productSku}>SKU: {product.sku}</Text>
                        )}
                        <Text style={styles.productPrice}>
                          {formatCurrency(product.price)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.productRight}>
                      <View style={[styles.stockBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.stockBadgeText, { color: status.color }]}>
                          {product.stock} {product.unit || 'cái'}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: status.color }]}>
                          {status.label}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditStock(product)}
                  >
                    <Ionicons name="create" size={16} color="#f59e0b" />
                    <Text style={styles.editButtonText}>Cập nhật tồn kho</Text>
                  </TouchableOpacity>
                </View>
              )
            })
          )}
        </View>
      </ScrollView>

      {/* Edit Stock Modal */}
      <Modal
        visible={!!editingProduct}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập nhật tồn kho</Text>
              <TouchableOpacity onPress={() => setEditingProduct(null)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {editingProduct && (
              <>
                <Text style={styles.modalProductName}>{editingProduct.name}</Text>
                <Text style={styles.modalLabel}>Số lượng tồn hiện tại: {editingProduct.stock}</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Số lượng mới</Text>
                  <TextInput
                    style={styles.input}
                    value={newStock}
                    onChangeText={setNewStock}
                    keyboardType="numeric"
                    placeholder="Nhập số lượng"
                    autoFocus
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalButtonCancel}
                    onPress={() => setEditingProduct(null)}
                  >
                    <Text style={styles.modalButtonCancelText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalButtonSave}
                    onPress={handleSaveStock}
                  >
                    <Text style={styles.modalButtonSaveText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Cập nhật thành công!"
        message="Số lượng tồn kho đã được cập nhật"
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
  header: {
    backgroundColor: '#fffbeb',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fef3c7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterTabActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTabTextActive: {
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
  productCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  productIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  productSku: {
    fontSize: 12,
    color: '#6b7280',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  productRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stockBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
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
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  modalLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalButtonSave: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
  },
  modalButtonSaveText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
})
