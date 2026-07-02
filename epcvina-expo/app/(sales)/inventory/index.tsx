import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl, TextInput, NativeScrollEvent, NativeSyntheticEvent, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useFocusEffect } from 'expo-router'
import { emitScrollVisibility } from '../_layout'
import { useTabBarHeight } from '../../../src/hooks/useTabBarHeight'
import AppHeader from '../../../src/components/AppHeader'

export default function InventoryScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  // Auto refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!loading && !refreshing) {
        fetchData()
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

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      if (!profileData || !['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
        router.replace('/(auth)/login')
        return
      }

      setProfile(profileData)

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      setCategories(categoriesData || [])

      // Fetch products with categories
      const { data: productsData } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .is('deleted_at', null)
        .order('name')

      setProducts(productsData || [])
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

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Hết hàng', color: '#ef4444', bg: '#fee2e2' }
    } else if (stock < 20) {
      return { label: 'Sắp hết', color: '#f59e0b', bg: '#fef3c7' }
    } else {
      return { label: 'Còn hàng', color: '#10b981', bg: '#d1fae5' }
    }
  }

  // Calculate categories with product count and filter out empty categories
  const categoriesWithProducts = useMemo(() => {
    const categoriesWithCount = categories
      .map(cat => ({
        ...cat,
        count: products.filter(p => p.category_id === cat.id).length
      }))
      .filter(cat => cat.count > 0) // Only show categories with products
    
    return [{ id: 'all', name: 'Tất cả', count: products.length }, ...categoriesWithCount]
  }, [categories, products])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Logo */}
      <AppHeader />

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Kho hàng</Text>
          <Text style={styles.subtitle}>
            {filteredProducts.length} sản phẩm
            {isAdmin && <Text style={styles.adminBadge}> • ADMIN</Text>}
          </Text>
        </View>
        {isAdmin && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(sales)/inventory/add')}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stock Summary */}
      {!searchQuery && !selectedCategory && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Còn hàng</Text>
              <Text style={styles.summaryValue}>
                {products.filter(p => p.stock >= 20).length}
              </Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="warning" size={20} color="#f59e0b" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Sắp hết</Text>
              <Text style={styles.summaryValue}>
                {products.filter(p => p.stock > 0 && p.stock < 20).length}
              </Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Hết hàng</Text>
              <Text style={styles.summaryValue}>
                {products.filter(p => p.stock === 0).length}
              </Text>
            </View>
          </View>
        </View>
      )}

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
        {categoriesWithProducts.slice(1).map((category) => (
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
              {category.name} ({category.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: contentPaddingBottom }]}
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
                : 'Chưa có sản phẩm nào trong kho'}
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
              const stockStatus = getStockStatus(product.stock)
              
              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => router.push(`/(sales)/inventory/${product.id}`)}
                  activeOpacity={0.7}
                >
                  {/* Product Image/Icon */}
                  <View style={styles.productImageContainer}>
                    {product.image_url ? (
                      <Image
                        source={{ uri: product.image_url }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="cube" size={40} color="#175ead" />
                    )}
                    <View style={[styles.stockBadge, { backgroundColor: stockStatus.bg }]}>
                      <Text style={[styles.stockBadgeText, { color: stockStatus.color }]}>
                        {stockStatus.label}
                      </Text>
                    </View>
                  </View>

                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    
                    <View style={styles.productMeta}>
                      <Text style={styles.productCategory} numberOfLines={1}>
                        {product.categories?.name || 'Uncategory'}
                      </Text>
                      {product.code && (
                        <Text style={styles.productCode}>{product.code}</Text>
                      )}
                    </View>

                    <View style={styles.productFooter}>
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Giá</Text>
                        <Text style={styles.priceAmount}>{formatCurrency(product.price)}</Text>
                      </View>
                      <View style={styles.stockContainer}>
                        <Text style={styles.stockLabel}>Kho</Text>
                        <Text style={styles.stockAmount}>{product.stock}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  adminBadge: {
    fontSize: 12,
    color: '#175ead',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#175ead',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#d1fae5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  categoryChipActive: {
    backgroundColor: '#175ead',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
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
    aspectRatio: 1,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeText: {
    fontSize: 10,
    fontWeight: '600',
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
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  productCategory: {
    fontSize: 11,
    color: '#6b7280',
    flex: 1,
  },
  productCode: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  priceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#175ead',
  },
  stockContainer: {
    alignItems: 'flex-end',
  },
  stockLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  stockAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
})
