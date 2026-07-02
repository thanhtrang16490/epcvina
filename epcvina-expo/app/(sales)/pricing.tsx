import { useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, TextInput, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'
import type { DiscountPolicy, CustomerSpecialPrice } from '../../src/types'

type ProductWithPrice = {
  id: string
  name: string
  code?: string
  price: number
  unit?: string
  category?: string
  image_url?: string
  has_special_price?: boolean
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' VNĐ'
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function PricingScreen() {
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const [products, setProducts] = useState<ProductWithPrice[]>([])
  const [discountPolicies, setDiscountPolicies] = useState<DiscountPolicy[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState<'products' | 'discounts'>('products')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      // Fetch products with base prices
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, code, price, unit, category, image_url')
        .is('deleted_at', null)
        .order('name', { ascending: true })
        .limit(500)

      if (productsError) throw productsError

      // Fetch active special prices to flag products
      const { data: specialPricesData } = await supabase
        .from('customer_special_prices')
        .select('product_id')
        .eq('is_active', true)

      const specialPriceProductIds = new Set(
        (specialPricesData || []).map((sp: any) => String(sp.product_id))
      )

      const enrichedProducts: ProductWithPrice[] = (productsData || []).map((p: any) => ({
        ...p,
        has_special_price: specialPriceProductIds.has(String(p.id)),
      }))

      setProducts(enrichedProducts)

      // Fetch active discount policies
      const now = new Date().toISOString()
      const { data: policiesData, error: policiesError } = await supabase
        .from('discount_policies')
        .select('*')
        .eq('is_active', true)
        .or(`effective_to.is.null,effective_to.gte.${now}`)
        .order('created_at', { ascending: false })

      if (policiesError) {
        // Table may not exist yet
        console.warn('discount_policies query failed:', policiesError.message)
        setDiscountPolicies([])
      } else {
        setDiscountPolicies(policiesData || [])
      }
    } catch (error) {
      console.error('Error fetching pricing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData().finally(() => setRefreshing(false))
  }

  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      (p.code && p.code.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    )
  })

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    if (currentScrollY > 50) {
      emitScrollVisibility(false)
    } else {
      emitScrollVisibility(true)
    }
  }

  const getPolicyStatus = (policy: DiscountPolicy) => {
    const now = new Date()
    if (!policy.is_active) return { label: 'Tắt', color: '#6b7280', bg: '#f3f4f6' }
    if (policy.effective_from && new Date(policy.effective_from) > now) {
      return { label: 'Sắp hiệu lực', color: '#d97706', bg: '#fef3c7' }
    }
    if (policy.effective_to && new Date(policy.effective_to) < now) {
      return { label: 'Hết hạn', color: '#ef4444', bg: '#fee2e2' }
    }
    return { label: 'Đang hoạt động', color: '#059669', bg: '#d1fae5' }
  }

  const getPolicyTarget = (policy: DiscountPolicy) => {
    if (policy.customer_id) return 'Khách hàng cụ thể'
    if (policy.product_group) return `Nhóm SP: ${policy.product_group}`
    if (policy.region) return `Khu vực: ${policy.region}`
    return 'Tất cả'
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#175ead" />
          <Text style={styles.loadingText}>Đang tải bảng giá...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <AppHeader />

        {/* Page Header */}
        <View style={styles.pageHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Bảng giá</Text>
              <Text style={styles.headerSubtitle}>
                {filteredProducts.length} sản phẩm
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="pricetag" size={22} color="#175ead" />
            </View>
          </View>

          {/* Section Tabs */}
          <View style={styles.sectionTabs}>
            <TouchableOpacity
              style={[
                styles.sectionTab,
                activeSection === 'products' && styles.sectionTabActive,
              ]}
              onPress={() => setActiveSection('products')}
            >
              <Ionicons
                name="cube"
                size={16}
                color={activeSection === 'products' ? 'white' : '#6b7280'}
              />
              <Text
                style={[
                  styles.sectionTabText,
                  activeSection === 'products' && styles.sectionTabTextActive,
                ]}
              >
                Sản phẩm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sectionTab,
                activeSection === 'discounts' && styles.sectionTabActive,
              ]}
              onPress={() => setActiveSection('discounts')}
            >
              <Ionicons
                name="gift"
                size={16}
                color={activeSection === 'discounts' ? 'white' : '#6b7280'}
              />
              <Text
                style={[
                  styles.sectionTabText,
                  activeSection === 'discounts' && styles.sectionTabTextActive,
                ]}
              >
                Chính sách ({discountPolicies.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar - only for products section */}
          {activeSection === 'products' && (
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#9ca3af" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm sản phẩm theo tên, mã..."
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
          )}
        </View>

        {/* Products Section */}
        {activeSection === 'products' && (
          <View style={[styles.listContainer, { paddingBottom: contentPaddingBottom }]}>
            {filteredProducts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={56} color="#d1d5db" />
                <Text style={styles.emptyTitle}>
                  {searchQuery ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery
                    ? `Không có kết quả cho "${searchQuery}"`
                    : 'Sản phẩm sẽ xuất hiện ở đây khi được thêm vào hệ thống'}
                </Text>
              </View>
            ) : (
              <View style={styles.productList}>
                {filteredProducts.map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <View style={styles.productHeader}>
                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={1}>
                          {product.name}
                        </Text>
                        {product.code && (
                          <Text style={styles.productCode}>{product.code}</Text>
                        )}
                      </View>
                      {product.has_special_price && (
                        <View style={styles.specialPriceBadge}>
                          <Ionicons name="pricetag" size={10} color="#175ead" />
                          <Text style={styles.specialPriceText}>Giá đặc biệt</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.productDetails}>
                      <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Giá gốc</Text>
                        <Text style={styles.priceValue}>
                          {formatCurrency(product.price)}
                        </Text>
                      </View>
                      {product.unit && (
                        <View style={styles.unitRow}>
                          <Text style={styles.unitLabel}>Đơn vị</Text>
                          <Text style={styles.unitValue}>{product.unit}</Text>
                        </View>
                      )}
                      {product.category && (
                        <View style={styles.categoryRow}>
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{product.category}</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Discount Policies Section */}
        {activeSection === 'discounts' && (
          <View style={[styles.listContainer, { paddingBottom: contentPaddingBottom }]}>
            {discountPolicies.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="gift-outline" size={56} color="#d1d5db" />
                <Text style={styles.emptyTitle}>Không có chính sách giảm giá</Text>
                <Text style={styles.emptySubtitle}>
                  Các chính sách giảm giá đang hoạt động sẽ hiển thị ở đây
                </Text>
              </View>
            ) : (
              <View style={styles.policyList}>
                {discountPolicies.map((policy) => {
                  const status = getPolicyStatus(policy)
                  return (
                    <View key={policy.id} style={styles.policyCard}>
                      <View style={styles.policyHeader}>
                        <View style={styles.policyInfo}>
                          <Text style={styles.policyName} numberOfLines={1}>
                            {policy.name}
                          </Text>
                          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                            <Text style={[styles.statusText, { color: status.color }]}>
                              {status.label}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.policyDetails}>
                        {/* Discount Value */}
                        <View style={styles.policyRow}>
                          <Text style={styles.policyLabel}>Giảm giá</Text>
                          <Text style={styles.policyValue}>
                            {policy.discount_type === 'percentage'
                              ? `${policy.discount_value}%`
                              : formatCurrency(policy.discount_value)}
                          </Text>
                        </View>
                        {/* Target */}
                        <View style={styles.policyRow}>
                          <Text style={styles.policyLabel}>Áp dụng</Text>
                          <Text style={styles.policyValue}>
                            {getPolicyTarget(policy)}
                          </Text>
                        </View>
                        {/* Date Range */}
                        <View style={styles.policyRow}>
                          <Text style={styles.policyLabel}>Hiệu lực</Text>
                          <Text style={styles.policyValue}>
                            {formatDate(policy.effective_from)} — {formatDate(policy.effective_to)}
                          </Text>
                        </View>
                        {/* Notes */}
                        {policy.notes && (
                          <Text style={styles.policyNotes} numberOfLines={2}>
                            {policy.notes}
                          </Text>
                        )}
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  pageHeader: {
    backgroundColor: '#f0f9ff',
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
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sectionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTabActive: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  sectionTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  sectionTabTextActive: {
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
    paddingVertical: 0,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  productList: {
    gap: 10,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  productCode: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  specialPriceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  specialPriceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#175ead',
  },
  productDetails: {
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#175ead',
  },
  unitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  unitValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  categoryRow: {
    marginTop: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  policyList: {
    gap: 10,
  },
  policyCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  policyInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  policyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  policyDetails: {
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  policyLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  policyValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  policyNotes: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
  },
})
