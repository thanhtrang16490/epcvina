import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, TextInput, NativeScrollEvent, NativeSyntheticEvent, Animated, Modal, Image, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useFocusEffect } from 'expo-router'
import { emitScrollVisibility } from './_layout'
import CustomerHeader from '../../src/components/CustomerHeader'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CART_STORAGE_KEY = '@customer_cart'
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300/e5e7eb/9ca3af?text=No+Image'

export default function ProductsScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastIdCounter = useRef(0)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; translateY: Animated.Value; opacity: Animated.Value }>>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showProductDetail, setShowProductDetail] = useState(false)

  useEffect(() => {
    fetchData()
    loadCartCount()
  }, [])

  // Auto refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!loading && !refreshing) {
        fetchData()
        loadCartCount()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category_id === selectedCategory)
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.code?.toLowerCase().includes(query) ||
        p.categories?.name?.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products])

  const fetchData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      setCategories(categoriesData || [])

      // Fetch products with categories - only products with stock > 0
      const { data: productsData } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .is('deleted_at', null)
        .gt('stock', 0) // Only show products with stock
        .order('name')

      const normalizedProducts = (productsData || []).map((product: any) => {
        const imageUrl =
          product.image_url ||
          product.image ||
          product.thumbnail_url ||
          product.photo_url ||
          null

        return {
          ...product,
          _imageUrl: imageUrl,
        }
      })

      setProducts(normalizedProducts)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    if (Math.abs(scrollDiff) > 5) {
      if (scrollDiff > 0 && currentScrollY > 50) {
        emitScrollVisibility(false)
      } else if (scrollDiff < 0) {
        emitScrollVisibility(true)
      }
      lastScrollY.current = currentScrollY
    }

    scrollTimeout.current = setTimeout(() => {
      emitScrollVisibility(true)
    }, 2000)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }

  const loadCartCount = async () => {
    try {
      const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY)
      if (cartJson) {
        const cart = JSON.parse(cartJson)
        const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartItemCount(totalItems)
      } else {
        setCartItemCount(0)
      }
    } catch (error) {
      console.error('Error loading cart count:', error)
    }
  }

  const addToastNotification = useCallback((message: string) => {
    const id = toastIdCounter.current++
    const translateY = new Animated.Value(-100)
    const opacity = new Animated.Value(0)

    const newToast = { id, message, translateY, opacity }
    setToasts(prev => [...prev, newToast])

    // Slide in from top
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    // Auto dismiss after 2 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      })
    }, 2000)
  }, [])

  const addToCart = async (product: any) => {
    try {
      // Load existing cart
      const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY)
      let cart = cartJson ? JSON.parse(cartJson) : []

      // Check if product already in cart
      const existingItemIndex = cart.findIndex((item: any) => item.id === product.id)
      
      if (existingItemIndex >= 0) {
        // Increase quantity
        const currentQuantity = cart[existingItemIndex].quantity
        if (currentQuantity < product.stock) {
          cart[existingItemIndex].quantity += 1
          addToastNotification(`Đã tăng số lượng "${product.name}"`)
        } else {
          addToastNotification(`Đã đạt tối đa tồn kho`)
          return
        }
      } else {
        // Add new item
        cart.push({ ...product, quantity: 1 })
        addToastNotification(`Đã thêm "${product.name}" vào giỏ`)
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      
      // Update cart count
      await loadCartCount()
    } catch (error) {
      console.error('Error adding to cart:', error)
      addToastNotification('Có lỗi khi thêm vào giỏ')
    }
  }

  const handleProductPress = (product: any) => {
    setSelectedProduct(product)
    setShowProductDetail(true)
  }

  const handleAddToCartFromDetail = () => {
    if (selectedProduct) {
      addToCart(selectedProduct)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <>
      {/* Toast notifications - global, above everything */}
      {toasts.map((toast, index) => (
        <Animated.View
          key={toast.id}
          style={[
            styles.toast,
            {
              top: insets.top + 16 + (index * 72), // Stack toasts with 72px spacing
              transform: [{ translateY: toast.translateY }],
              opacity: toast.opacity,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      ))}

      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <CustomerHeader />

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Sản phẩm</Text>
          <Text style={styles.subtitle}>
            {filteredProducts.length} sản phẩm có sẵn
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push('/(customer)/selling')}
        >
          <Ionicons name="cart" size={20} color="white" />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !selectedCategory && styles.categoryChipActive
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[
            styles.categoryChipText,
            !selectedCategory && styles.categoryChipTextActive
          ]}>
            Tất cả ({products.length})
          </Text>
        </TouchableOpacity>
        {categories
          .filter(category => {
            // Only show categories that have products with stock > 0
            return products.some(p => p.category_id === category.id)
          })
          .map((category) => {
            // Count products in this category
            const productCount = products.filter(p => p.category_id === category.id).length
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category.id && styles.categoryChipTextActive
                ]}>
                  {category.name} ({productCount})
                </Text>
              </TouchableOpacity>
            )
          })}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory 
                ? 'Không tìm thấy sản phẩm nào' 
                : 'Chưa có sản phẩm nào'}
            </Text>
            {(searchQuery || selectedCategory) && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                }}
              >
                <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => {
              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => handleProductPress(product)}
                  activeOpacity={0.7}
                >
                  {/* Product Image/Icon */}
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: product._imageUrl || PLACEHOLDER_IMAGE }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    
                    {product.code && (
                      <Text style={styles.productCode}>{product.code}</Text>
                    )}

                    <View style={styles.productFooter}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Giá: </Text>
                        <Text style={styles.priceAmount}>{formatCurrency(product.price)}</Text>
                      </View>
                      {product.unit && (
                        <Text style={styles.productUnit}>/{product.unit}</Text>
                      )}
                    </View>

                    {/* Add to Cart Button */}
                    <TouchableOpacity 
                      style={styles.addToCartButton}
                      onPress={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                    >
                      <Ionicons name="cart-outline" size={16} color="white" />
                      <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </ScrollView>

      {/* Product Detail Modal */}
      <Modal
        visible={showProductDetail}
        animationType="slide"
        transparent
        onRequestClose={() => setShowProductDetail(false)}
      >
        <View style={styles.modalRoot}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowProductDetail(false)}
          />
          <KeyboardAvoidingView
            style={styles.productDetailModal}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {selectedProduct && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Chi tiết sản phẩm</Text>
                  <TouchableOpacity onPress={() => setShowProductDetail(false)}>
                    <Ionicons name="close" size={24} color="#111827" />
                  </TouchableOpacity>
                </View>

                {/* Modal Body */}
                <ScrollView
                  style={styles.modalBody}
                  contentContainerStyle={styles.modalBodyContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Product Card */}
                  <View style={styles.detailProductCard}>
                    <View style={styles.detailProductCardTop} />
                    
                    <View style={styles.detailProductHeader}>
                      <View style={styles.detailProductIconContainer}>
                        <Image
                          source={{ uri: selectedProduct._imageUrl || PLACEHOLDER_IMAGE }}
                          style={styles.detailProductImage}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.detailAvailableBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                        <Text style={styles.detailAvailableBadgeText}>Còn hàng</Text>
                      </View>
                    </View>

                    <View style={styles.detailProductBody}>
                      <Text style={styles.detailName}>{selectedProduct.name}</Text>
                      {selectedProduct.code && (
                        <Text style={styles.detailCode}>Mã: {selectedProduct.code}</Text>
                      )}
                      {selectedProduct.categories && (
                        <View style={styles.detailCategoryBadge}>
                          <Ionicons name="pricetag" size={12} color="#6b7280" />
                          <Text style={styles.detailCategoryText}>{selectedProduct.categories.name}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Price Section */}
                  <View style={styles.detailInfoCard}>
                    <View style={styles.detailPriceContainer}>
                      <Text style={styles.detailPriceLabel}>Giá bán</Text>
                      <View style={styles.detailPriceRow}>
                        <Text style={styles.detailPrice}>{formatCurrency(selectedProduct.price)}</Text>
                        {selectedProduct.unit && (
                          <Text style={styles.detailUnit}>/{selectedProduct.unit}</Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  {selectedProduct.description && (
                    <View style={styles.detailInfoCard}>
                      <Text style={styles.detailSectionTitle}>Mô tả sản phẩm</Text>
                      <Text style={styles.detailDescription}>{selectedProduct.description}</Text>
                    </View>
                  )}

                  {/* Additional Info */}
                  <View style={styles.detailInfoCard}>
                    <Text style={styles.detailSectionTitle}>Thông tin chi tiết</Text>
                    
                    {selectedProduct.code && (
                      <View style={styles.detailInfoRow}>
                        <View style={styles.detailInfoIcon}>
                          <Ionicons name="barcode-outline" size={20} color="#6b7280" />
                        </View>
                        <View style={styles.detailInfoContent}>
                          <Text style={styles.detailInfoLabel}>Mã sản phẩm</Text>
                          <Text style={styles.detailInfoValue}>{selectedProduct.code}</Text>
                        </View>
                      </View>
                    )}

                    {selectedProduct.categories && (
                      <View style={styles.detailInfoRow}>
                        <View style={styles.detailInfoIcon}>
                          <Ionicons name="pricetag-outline" size={20} color="#6b7280" />
                        </View>
                        <View style={styles.detailInfoContent}>
                          <Text style={styles.detailInfoLabel}>Danh mục</Text>
                          <Text style={styles.detailInfoValue}>{selectedProduct.categories.name}</Text>
                        </View>
                      </View>
                    )}

                    {selectedProduct.unit && (
                      <View style={styles.detailInfoRow}>
                        <View style={styles.detailInfoIcon}>
                          <Ionicons name="scale-outline" size={20} color="#6b7280" />
                        </View>
                        <View style={styles.detailInfoContent}>
                          <Text style={styles.detailInfoLabel}>Đơn vị tính</Text>
                          <Text style={styles.detailInfoValue}>{selectedProduct.unit}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </ScrollView>

                {/* Fixed Footer */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.detailAddToCartButton}
                    onPress={handleAddToCartFromDetail}
                  >
                    <Ionicons name="cart" size={20} color="white" />
                    <Text style={styles.detailAddToCartText}>Thêm vào giỏ hàng</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </View>
      </Modal>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  pageHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  cartButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#f0f9ff',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f0f9ff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f0f9ff',
    maxHeight: 44,
  },
  categoryContent: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  clearButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    minHeight: 36,
  },
  productCode: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  priceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  productUnit: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 8,
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  toast: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  productDetailModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '82%',
    minHeight: 520,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  detailProductCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailProductCardTop: {
    height: 8,
    backgroundColor: '#d1fae5',
  },
  detailProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 12,
  },
  detailProductIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailProductImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  detailAvailableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#d1fae5',
  },
  detailAvailableBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
  },
  detailProductBody: {
    padding: 20,
    paddingTop: 8,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  detailCode: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  detailCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  detailCategoryText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailPriceContainer: {
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
  },
  detailPriceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  detailUnit: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  detailDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  detailInfoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailInfoContent: {
    flex: 1,
  },
  detailInfoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: 'white',
  },
  detailAddToCartButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
  },
  detailAddToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
