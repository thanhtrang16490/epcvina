/**
 * Animated Product Card Component
 * Example integration of Phase 3 animation utilities
 */

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { useFadeSlideIn, useShake } from '../hooks/useAnimation'
import { Analytics, AnalyticsEvents } from '../lib/analytics'
import { createDeepLink, shareDeepLink } from '../lib/deep-linking'

interface Product {
  id: string
  name: string
  price: number
  image?: string
}

interface AnimatedProductCardProps {
  product: Product
  onPress?: () => void
  onAddToCart?: () => void
}

export function AnimatedProductCard({ product, onPress, onAddToCart }: AnimatedProductCardProps) {
  const { opacity, translateY } = useFadeSlideIn(20, 300)
  const { shake, translateX } = useShake()

  const handlePress = () => {
    // Track product view
    Analytics.trackEvent(AnalyticsEvents.PRODUCT_VIEWED, {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
    })

    onPress?.()
  }

  const handleAddToCart = () => {
    // Track add to cart
    Analytics.trackEvent(AnalyticsEvents.ADD_TO_CART, {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
    })

    onAddToCart?.()
  }

  const handleShare = async () => {
    // Track share
    Analytics.trackEvent(AnalyticsEvents.PRODUCT_SHARED, {
      product_id: product.id,
      product_name: product.name,
    })

    // Share deep link
    const success = await shareDeepLink(
      'customer/products',
      { id: product.id },
      `Xem sản phẩm ${product.name}!`
    )

    if (!success) {
      shake() // Shake on error
    }
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    >
      <TouchableOpacity onPress={handlePress} style={styles.content}>
        <View style={styles.imageContainer}>
          {product.image ? (
            <Text style={styles.imagePlaceholder}>📷</Text>
          ) : (
            <Text style={styles.imagePlaceholder}>📦</Text>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.price}>
            {product.price.toLocaleString('vi-VN')} đ
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleAddToCart} style={styles.addButton}>
            <Text style={styles.addButtonText}>Thêm</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Text style={styles.shareButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePlaceholder: {
    fontSize: 48,
  },
  info: {
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#175ead',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#175ead',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 20,
  },
})
