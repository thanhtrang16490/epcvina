import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Product } from '../../../src/types'
import { supabasePublic } from '../../../src/lib/supabase-public'


const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400/e5e7eb/9ca3af?text=No+Image'

/**
 * Public Product Detail Screen
 * Hiển thị chi tiết sản phẩm cho khách chưa đăng nhập.
 * CTA dẫn đến trang đăng nhập để đặt hàng.
 */
export default function PublicProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    if (id) fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabasePublic
        .from('products')
        .select('id,name,code,description,price,stock,category_id,image_url,created_at,unit,specifications')
        .eq('id', id)
        .is('deleted_at', null) // Only get non-deleted products
        .single()

      if (error) {
        if (__DEV__) console.error('[PublicProductDetail] error:', error)
        setLoading(false)
        return
      }

      const product = data as Product
      setProduct(product)

      // Fetch category name if exists
      if (product.category_id) {
        const { data: categoryData } = await supabasePublic
          .from('categories')
          .select('name')
          .eq('id', product.category_id)
          .single()

        if (categoryData) {
          setCategoryName(categoryData.name || '')
        }
      }
    } catch (e) {
      if (__DEV__) console.error('[PublicProductDetail] catch:', e)
    } finally {
      setLoading(false)
    }
  }

  const onShare = async () => {
    if (!product) return
    try {
      await Share.share({
        title: product.name,
        message: `${product.name} - ${formatPrice(product.price)}\n\nXem thêm tại ứng dụng EPCVINA`,
      })
    } catch {
      // Silently fail
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#175ead" />
      </View>
    )
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={56} color="#d1d5db" />
        <Text style={styles.notFoundText}>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <Image
          source={{ uri: product.image_url || PLACEHOLDER_IMAGE }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          {/* Category & Code */}
          <View style={styles.metaRow}>
            {categoryName ? (
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{categoryName}</Text>
              </View>
            ) : null}
            {product.code ? (
              <Text style={styles.productCode}>Mã: {product.code}</Text>
            ) : null}
          </View>

          {/* Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Price */}
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          {product.description ? (
            <>
              <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          ) : (
            <Text style={styles.noDescription}>Chưa có mô tả sản phẩm.</Text>
          )}

          {/* Info Notice */}
          <View style={styles.noticeBanner}>
            <Ionicons name="information-circle-outline" size={18} color="#175ead" />
            <Text style={styles.noticeText}>
              Giá có thể thay đổi. Đăng nhập để xem giá ưu đãi và đặt hàng trực tiếp.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA Footer */}
      <View style={styles.ctaFooter}>
        <TouchableOpacity
          style={styles.ctaSecondary}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color="#175ead" />
          <Text style={styles.ctaSecondaryText}>Xem thêm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ctaPrimary}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.8}
        >
          <Ionicons name="cart" size={18} color="#fff" />
          <Text style={styles.ctaPrimaryText}>Đăng nhập để đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#175ead',
  },
  productCode: {
    fontSize: 12,
    color: '#9ca3af',
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 30,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: '#175ead',
    marginBottom: 12,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  stockOutBadge: {
    backgroundColor: '#fee2e2',
  },
  stockLowBadge: {
    backgroundColor: '#fef3c7',
  },
  stockText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065f46',
  },
  stockOutText: {
    color: '#991b1b',
  },
  stockLowText: {
    color: '#92400e',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  noDescription: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  backButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  ctaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#175ead',
    backgroundColor: '#eff6ff',
  },
  ctaSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#175ead',
  },
  ctaPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#175ead',
  },
  ctaPrimaryDisabled: {
    backgroundColor: '#9ca3af',
  },
  ctaPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
})
