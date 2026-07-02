/**
 * CachedImage - Component ảnh có cache local
 * Dùng expo-file-system để lưu ảnh vào bộ nhớ thiết bị
 *
 * Features:
 * - Cache ảnh từ URL vào local storage
 * - Hiển thị placeholder khi đang tải
 * - Fallback khi lỗi
 * - Cache key dựa trên URL hash
 * - Tự động dùng cache nếu đã có
 */

import React, { useState, useEffect, useRef } from 'react'
import { Image, View, StyleSheet, ImageStyle, ViewStyle } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { Ionicons } from '@expo/vector-icons'

// expo-file-system v19 thay đổi API - dùng type assertion để tương thích
const FS = FileSystem as any
const CACHE_DIR = `${FS.cacheDirectory ?? FS.documentDirectory ?? ''}img_cache/`

/**
 * Tạo cache key từ URL (đơn giản, không cần crypto)
 */
function urlToFilename(url: string): string {
  // Lấy phần cuối URL + hash đơn giản
  const encoded = url.replace(/[^a-zA-Z0-9]/g, '_').slice(-80)
  return `${encoded}.jpg`
}

/**
 * Đảm bảo thư mục cache tồn tại
 */
async function ensureCacheDir(): Promise<void> {
  const dirInfo = await FS.getInfoAsync(CACHE_DIR)
  if (!dirInfo.exists) {
    await FS.makeDirectoryAsync(CACHE_DIR, { intermediates: true })
  }
}

/**
 * Lấy ảnh từ cache hoặc download về
 */
async function getCachedImageUri(url: string): Promise<string> {
  await ensureCacheDir()
  const filename = urlToFilename(url)
  const localPath = `${CACHE_DIR}${filename}`

  const fileInfo = await FS.getInfoAsync(localPath)
  if (fileInfo.exists) {
    return localPath
  }

  // Download và cache
  const result = await FS.downloadAsync(url, localPath)
  return result.uri
}

/**
 * Xóa toàn bộ cache ảnh
 */
export async function clearImageCache(): Promise<void> {
  try {
    const dirInfo = await FS.getInfoAsync(CACHE_DIR)
    if (dirInfo.exists) {
      await FS.deleteAsync(CACHE_DIR, { idempotent: true })
    }
  } catch {
    // Silently fail
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CachedImageProps {
  uri?: string | null
  style?: ImageStyle
  containerStyle?: ViewStyle
  placeholderIcon?: string
  placeholderColor?: string
  placeholderBg?: string
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'
  fallbackIcon?: string
}

export default function CachedImage({
  uri,
  style,
  containerStyle,
  placeholderIcon = 'image-outline',
  placeholderColor = '#9ca3af',
  placeholderBg = '#f3f4f6',
  resizeMode = 'cover',
  fallbackIcon = 'image-outline',
}: CachedImageProps) {
  const [cachedUri, setCachedUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (!uri) {
      setLoading(false)
      setError(true)
      return
    }

    setLoading(true)
    setError(false)
    setCachedUri(null)

    getCachedImageUri(uri)
      .then((localUri) => {
        if (mountedRef.current) {
          setCachedUri(localUri)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mountedRef.current) {
          // Fallback: dùng URI gốc nếu cache thất bại
          setCachedUri(uri)
          setLoading(false)
        }
      })
  }, [uri])

  const flatStyle = StyleSheet.flatten(style) || {}
  const width = (flatStyle as any).width || 60
  const height = (flatStyle as any).height || 60

  // Placeholder khi đang tải hoặc lỗi
  if (loading || error || !cachedUri) {
    return (
      <View
        style={[
          styles.placeholder,
          { width, height, backgroundColor: placeholderBg, borderRadius: (flatStyle as any).borderRadius || 8 },
          containerStyle,
        ]}
      >
        <Ionicons
          name={(error ? fallbackIcon : placeholderIcon) as any}
          size={Math.min(width, height) * 0.4}
          color={placeholderColor}
        />
      </View>
    )
  }

  return (
    <Image
      source={{ uri: cachedUri }}
      style={style}
      resizeMode={resizeMode}
      onError={() => {
        if (mountedRef.current) setError(true)
      }}
    />
  )
}

const styles = StyleSheet.create({
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
