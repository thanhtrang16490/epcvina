import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'

export default function WarehouseReportsScreen() {
  const { contentPaddingBottom } = useTabBarHeight()
  const [productStats, setProductStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sortBy, setSortBy] = useState<'stock' | 'orders'>('stock')

  useEffect(() => {
    fetchReports()
  }, [sortBy])

  const onRefresh = () => {
    setRefreshing(true)
    fetchReports().finally(() => setRefreshing(false))
  }

  const fetchReports = async () => {
    try {
      setLoading(true)

      // Fetch all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, sku, stock, unit, price')
        .order('name', { ascending: true })

      if (productsError) throw productsError

      // For each product, count orders
      const statsPromises = (products || []).map(async (product) => {
        const { count } = await supabase
          .from('order_items')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', product.id)

        return {
          ...product,
          orderCount: count || 0
        }
      })

      const stats = await Promise.all(statsPromises)

      // Sort by selected criteria
      const sorted = stats.sort((a, b) => {
        if (sortBy === 'stock') {
          return a.stock - b.stock // Low stock first
        } else {
          return b.orderCount - a.orderCount // Most orders first
        }
      })

      setProductStats(sorted)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
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
            <Text style={styles.headerTitle}>Báo cáo kho</Text>
            <Text style={styles.headerSubtitle}>Thống kê theo mặt hàng</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="bar-chart" size={24} color="#f59e0b" />
          </View>
        </View>

        {/* Sort Tabs */}
        <View style={styles.sortTabs}>
          <TouchableOpacity
            style={[styles.sortTab, sortBy === 'stock' && styles.sortTabActive]}
            onPress={() => setSortBy('stock')}
          >
            <Text style={[styles.sortTabText, sortBy === 'stock' && styles.sortTabTextActive]}>
              Theo tồn kho
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortTab, sortBy === 'orders' && styles.sortTabActive]}
            onPress={() => setSortBy('orders')}
          >
            <Text style={[styles.sortTabText, sortBy === 'orders' && styles.sortTabTextActive]}>
              Theo đơn hàng
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
          {/* Summary Stats */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Tổng sản phẩm</Text>
              <Text style={styles.summaryValue}>{productStats.length}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Sắp hết hàng</Text>
              <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>
                {productStats.filter(p => p.stock < 20 && p.stock > 0).length}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Hết hàng</Text>
              <Text style={[styles.summaryValue, { color: '#dc2626' }]}>
                {productStats.filter(p => p.stock === 0).length}
              </Text>
            </View>
          </View>

          {/* Product List */}
          <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
          {productStats.map((product, index) => {
            const status = getStockStatus(product.stock)
            return (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productRank}>
                  <Text style={styles.productRankText}>#{index + 1}</Text>
                </View>
                <View style={styles.productMain}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                  {product.sku && (
                    <Text style={styles.productSku}>SKU: {product.sku}</Text>
                  )}
                  <View style={styles.productStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="cube" size={14} color="#6b7280" />
                      <Text style={styles.statText}>
                        Tồn: {product.stock} {product.unit || 'cái'}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="receipt" size={14} color="#6b7280" />
                      <Text style={styles.statText}>
                        Đơn: {product.orderCount}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="cash" size={14} color="#6b7280" />
                      <Text style={styles.statText}>
                        {formatCurrency(product.price)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
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
  sortTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  sortTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sortTabActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  sortTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  sortTabTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productRank: {
    width: 32,
    height: 32,
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  productMain: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
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
  productSku: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  productStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
})
