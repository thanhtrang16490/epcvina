import { useCallback, useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// Product type
export interface ProductType {
  id: number
  name: string
  price: number
  stock: number
  image_url?: string | null
  code?: string | null
  category_id?: number | null
}

// Category type
export interface CategoryType {
  id: number | string
  name: string
  count?: number
}

interface ProductGridProps {
  products: ProductType[]
  categories: CategoryType[]
  searchQuery: string
  onSearchChange: (query: string) => void
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
  onAddToCart: (product: ProductType) => void
  formatCurrency: (amount: number) => string
}

export default function ProductGrid({
  products,
  categories,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onAddToCart,
  formatCurrency,
}: ProductGridProps) {
  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (activeCategory !== 'all') {
      const categoryId = parseInt(activeCategory)
      filtered = filtered.filter(p => {
        if (!p.category_id) return false
        return p.category_id === categoryId
      })
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.code?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [products, activeCategory, searchQuery])

  // Build categories with product counts
  const categoriesWithProducts = useMemo(() => {
    const categoriesWithCount = categories
      .map(cat => ({
        ...cat,
        count: products.filter(p => p.category_id === cat.id).length
      }))
      .filter(cat => cat.count > 0)

    return [
      { id: 'all', name: 'Tất cả', count: products.length },
      ...categoriesWithCount
    ]
  }, [categories, products])

  const renderProductItem = useCallback(({ item }: { item: ProductType }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => onAddToCart(item)}
      activeOpacity={0.7}
    >
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.productIcon}>
          <Ionicons name="cube" size={24} color="#175ead" />
        </View>
      )}
      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
      <Text style={styles.productStock}>Còn: {item.stock}</Text>
    </TouchableOpacity>
  ), [onAddToCart, formatCurrency])

  const renderCategoryItem = useCallback(({ item }: { item: CategoryType | { id: string; name: string; count: number } }) => {
    const isAll = item.id === 'all'
    const isActive = isAll ? activeCategory === 'all' : activeCategory === item.id.toString()
    
    return (
      <TouchableOpacity
        style={[styles.categoryChip, isActive && styles.categoryChipActive]}
        onPress={() => onCategoryChange(isAll ? 'all' : item.id.toString())}
      >
        <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
          {item.name} ({item.count})
        </Text>
      </TouchableOpacity>
    )
  }, [activeCategory, onCategoryChange])

  const keyExtractor = useCallback((item: ProductType) => item.id.toString(), [])

  const categoryKeyExtractor = useCallback((item: CategoryType | { id: string | number; name: string; count: number }) => 
    item.id.toString(), 
  [])

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm sản phẩm..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoriesWithProducts}
          renderItem={renderCategoryItem}
          keyExtractor={categoryKeyExtractor}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={keyExtractor}
        numColumns={3}
        contentContainerStyle={styles.productsGridContent}
        columnWrapperStyle={styles.productsGridRow}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.emptyProducts}>
            <Ionicons name="cube-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyProductsText}>Không tìm thấy sản phẩm</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#175ead',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryTextActive: {
    color: 'white',
  },
  productsGridContent: {
    padding: 16,
    paddingBottom: 32,
  },
  productsGridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  productIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#175ead',
    marginBottom: 2,
  },
  productStock: {
    fontSize: 10,
    color: '#6b7280',
  },
  emptyProducts: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyProductsText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
  },
})

