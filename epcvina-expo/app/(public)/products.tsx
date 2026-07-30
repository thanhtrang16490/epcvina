import { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useDebounce } from '../../src/hooks/useDebounce'
import { Product, Category } from '../../src/types'
import { UI_CONFIG, PAGINATION_CONFIG } from '../../src/constants/config'
import { apiClient } from '../../src/lib/api-client'


const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150/e5e7eb/9ca3af?text=No+Image'
const PAGE_SIZE = PAGINATION_CONFIG.defaultPageSize

/**
 * Public Products Screen
 * Khách chưa đăng nhập xem danh sách sản phẩm và giá.
 * Nguồn dữ liệu lấy từ epcvinaapi `/api/catalog`.
 */
export default function PublicProductsScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)
  const pageRef = useRef(1)

  const debouncedSearch = useDebounce(searchQuery, UI_CONFIG.searchDebounceMs)

  // ─── Data fetching ──────────────────────────────────────────────────────────

  const loadProducts = async (page: number, search: string, category: string): Promise<{ data: Product[] | null; error: string | null }> => {
    try {
      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const response = await apiClient.get<{
        data?: { products?: Array<{ id: string; slug?: string; name?: string; category?: string; brand?: string; unit?: string; sale_price_vat?: number; description?: string; cover_image_url?: string; image_urls?: string[]; is_active?: boolean; sort_order?: number }> }
      }>('/catalog')

      if (response.error) {
        return { data: null, error: response.error || 'Không thể tải thiết bị' }
      }

      const rows = response.data?.data?.products ?? []
      const normalized = rows
        .filter((row) => row.is_active !== false)
        .map((row) => ({
          id: String(row.id),
          name: String(row.name ?? ''),
          code: String(row.slug ?? ''),
          description: String(row.description ?? ''),
          price: Number(row.sale_price_vat ?? 0),
          stock: 999,
          category: String(row.category ?? ''),
          image_url: row.cover_image_url || row.image_urls?.[0] || '',
          unit: String(row.unit ?? ''),
          specifications: '',
          created_at: new Date().toISOString(),
          deleted_at: null,
          sort_order: Number(row.sort_order ?? 0),
        })) as Product[]

      let filtered = normalized

      if (search.trim().length >= UI_CONFIG.searchMinChars) {
        const searchTerm = search.trim().toLowerCase()
        filtered = filtered.filter((row) =>
          [row.name, row.code, row.category].some((value) => String(value ?? '').toLowerCase().includes(searchTerm))
        )
      }

      if (category !== 'all') {
        filtered = filtered.filter((row) => row.category === category)
      }

      filtered.sort((a, b) => String(a.name).localeCompare(String(b.name), 'vi'))
      return { data: filtered.slice(from, to + 1), error: null }
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e)
      if (__DEV__) console.error('[PublicProducts] loadProducts catch:', err)
      return { data: null, error: err }
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get<{ data?: { products?: Array<{ category?: string }> } }>('/catalog')
      const productRows = response.data?.data?.products ?? []
      const uniqueCategories = Array.from(
        new Set(productRows.map((row) => String(row.category ?? '').trim()).filter(Boolean))
      )
      setCategories(
        uniqueCategories.map((name, index) => ({
          id: index + 1,
          name,
          description: undefined,
          created_at: new Date().toISOString(),
        }))
      )
    } catch (e) {
      if (__DEV__) console.warn('[PublicProducts] categories catch:', e)
    }
  }

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    pageRef.current = 1

    const run = async () => {
      const { data, error: err } = await loadProducts(1, debouncedSearch, activeCategory)
      if (cancelled) return
      if (err) {
        setError(err)
      } else {
        setProducts(data ?? [])
        pageRef.current = 2
        setHasMore((data?.length ?? 0) === PAGE_SIZE)
      }
      setLoading(false)
    }

    run()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, activeCategory])

  // ─── Actions ────────────────────────────────────────────────────────────────

  const onRefresh = async () => {
    setRefreshing(true)
    setError(null)
    pageRef.current = 1
    const { data, error: err } = await loadProducts(1, debouncedSearch, activeCategory)
    if (!err && data) {
      setProducts(data)
      pageRef.current = 2
      setHasMore(data.length === PAGE_SIZE)
    } else if (err) {
      setError(err)
    }
    setRefreshing(false)
  }

  const onEndReached = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const { data } = await loadProducts(pageRef.current, debouncedSearch, activeCategory)
    if (data && data.length > 0) {
      setProducts(prev => [...prev, ...data])
      pageRef.current += 1
      setHasMore(data.length === PAGE_SIZE)
    } else {
      setHasMore(false)
    }
    setLoadingMore(false)
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  // ─── Render ─────────────────────────────────────────────────────────────────

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/(public)/product/${item.id}` as never)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: item.image_url || PLACEHOLDER_IMAGE }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        {item.code ? <Text style={styles.productCode}>{item.code}</Text> : null}
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  )

  const renderListEmpty = () => {
    if (loading) return null
    if (error) {
      return (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={56} color="#fca5a5" />
          <Text style={styles.emptyTitle}>Không thể tải thiết bị</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => { setSearchQuery(''); setActiveCategory('all') }}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.centered}>
        <Ionicons name="cube-outline" size={56} color="#d1d5db" />
        <Text style={styles.emptyTitle}>Không tìm thấy thiết bị</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery || activeCategory !== 'all'
            ? 'Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm'
            : 'Danh sách thiết bị đang trống'}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm thiết bị theo tên, mã..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Category Filter */}
      {categories.length > 0 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: 0, name: 'Tất cả', description: undefined, created_at: '' }, ...categories]}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const key = item.id === 0 ? 'all' : String(item.id)
            const isActive = activeCategory === key
            return (
              <TouchableOpacity
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(key)}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )
          }}
          style={styles.categoryScroll}
        />
      )}

      {/* Product Grid */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#175ead" />
          <Text style={styles.loadingText}>Đang tải thiết bị...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={renderProduct}
          ListEmptyComponent={renderListEmpty}
          contentContainerStyle={[styles.productGrid, products.length === 0 && styles.productGridEmpty]}
          columnWrapperStyle={products.length > 0 ? styles.row : undefined}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? (
            <View style={styles.loadingMore}><ActivityIndicator size="small" color="#175ead" /></View>
          ) : null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#175ead" />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  categoryChip: {
    backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: 20, borderWidth: 1,
    marginRight: 8, paddingHorizontal: 14, paddingVertical: 7,
  },
  categoryChipActive: { backgroundColor: '#175ead', borderColor: '#175ead' },
  categoryList: { gap: 8, paddingHorizontal: 16 },
  categoryScroll: { flexGrow: 0, marginBottom: 8 },
  categoryText: { color: '#6b7280', fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: '#fff' },
  centered: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center', paddingVertical: 60 },
  container: { backgroundColor: '#f9fafb', flex: 1 },
  emptySubtitle: { color: '#9ca3af', fontSize: 13, paddingHorizontal: 32, textAlign: 'center' },
  emptyTitle: { color: '#374151', fontSize: 16, fontWeight: '600', marginTop: 8 },
  loadingMore: { alignItems: 'center', paddingVertical: 20 },
  loadingText: { color: '#6b7280', fontSize: 14, marginTop: 8 },
  productCard: {
    backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: 12, borderWidth: 1,
    elevation: 2, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, width: '48.5%',
  },
  productCode: { color: '#9ca3af', fontSize: 11, marginBottom: 2 },
  productGrid: { paddingBottom: 80, paddingHorizontal: 12 },
  productGridEmpty: { flex: 1 },
  productImage: { backgroundColor: '#f3f4f6', height: 130, width: '100%' },
  productInfo: { padding: 10 },
  productName: { color: '#111827', fontSize: 13, fontWeight: '600', lineHeight: 18, marginBottom: 6 },
  productPrice: { color: '#175ead', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  retryButton: { backgroundColor: '#175ead', borderRadius: 20, marginTop: 4, paddingHorizontal: 24, paddingVertical: 10 },
  retryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  searchContainer: {
    alignItems: 'center', backgroundColor: '#fff', borderColor: '#e5e7eb',
    borderRadius: 12, borderWidth: 1, elevation: 2, flexDirection: 'row',
    marginHorizontal: 16, marginVertical: 12,
    paddingHorizontal: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { color: '#111827', flex: 1, fontSize: 15, height: 44 },
})
