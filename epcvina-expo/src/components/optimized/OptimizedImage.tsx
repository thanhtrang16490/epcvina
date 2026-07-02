import React, { useState, memo } from 'react'
import { Image, ImageProps, View, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/colors'

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  uri: string
  width?: number
  height?: number
  showLoader?: boolean
  loaderColor?: string
  fallbackSource?: ImageProps['source']
  onLoadStart?: () => void
  onLoadEnd?: () => void
  onError?: () => void
}

/**
 * Optimized Image component với:
 * - Loading state
 * - Error handling
 * - Fallback image
 * - Progressive loading
 * - Memoization
 * 
 * @param uri - Image URL
 * @param width - Image width
 * @param height - Image height
 * @param showLoader - Show loading indicator
 * @param loaderColor - Loader color
 * @param fallbackSource - Fallback image khi error
 * @param onLoadStart - Callback khi bắt đầu load
 * @param onLoadEnd - Callback khi load xong
 * @param onError - Callback khi có error
 */
function OptimizedImageComponent({
  uri,
  width,
  height,
  showLoader = true,
  loaderColor = COLORS.PRIMARY.DEFAULT,
  fallbackSource,
  onLoadStart,
  onLoadEnd,
  onError,
  style,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoadStart = () => {
    setLoading(true)
    setError(false)
    onLoadStart?.()
  }

  const handleLoadEnd = () => {
    setLoading(false)
    onLoadEnd?.()
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
    onError?.()
  }

  const sizeStyle = {
    ...(width != null ? { width } : {}),
    ...(height != null ? { height } : {}),
  }

  if (error && fallbackSource) {
    return (
      <Image
        source={fallbackSource}
        style={[style, sizeStyle]}
        {...props}
      />
    )
  }

  return (
    <View style={[styles.container, sizeStyle]}>
      <Image
        source={{ uri }}
        style={[styles.image, style]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />
      {loading && showLoader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={loaderColor} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
})

/**
 * Memoized version - chỉ re-render khi uri thay đổi
 */
export const OptimizedImage = memo(OptimizedImageComponent, (prevProps, nextProps) => {
  return (
    prevProps.uri === nextProps.uri &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height
  )
})
