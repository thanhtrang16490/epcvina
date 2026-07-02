import { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import NetInfo, { NetInfoState } from '@react-native-community/netinfo'
import { Ionicons } from '@expo/vector-icons'

/**
 * OfflineBanner
 * Hiển thị banner thông báo khi mất kết nối mạng.
 * Tự động ẩn khi kết nối lại.
 */
export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)
  const translateY = useRef(new Animated.Value(-60)).current
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const offline = !state.isConnected || state.isConnected === null
      setIsOffline(offline)

      if (!offline && wasOffline) {
        // Vừa kết nối lại — hiện banner "Đã kết nối" rồi ẩn sau 2s
        setWasOffline(false)
        if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
        reconnectTimer.current = setTimeout(() => {
          setIsOffline(false)
        }, 2000)
      }

      if (offline) {
        setWasOffline(true)
      }
    })

    return () => {
      unsubscribe()
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
    }
  }, [wasOffline])

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOffline ? 0 : -60,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start()
  }, [isOffline])

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY }] }]}
      pointerEvents="none"
    >
      <View style={[styles.content, wasOffline && !isOffline ? styles.contentOnline : styles.contentOffline]}>
        <Ionicons
          name={wasOffline && !isOffline ? 'wifi' : 'wifi-outline'}
          size={16}
          color="white"
        />
        <Text style={styles.text}>
          {wasOffline && !isOffline ? 'Đã kết nối lại' : 'Không có kết nối mạng'}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  contentOffline: {
    backgroundColor: '#ef4444',
  },
  contentOnline: {
    backgroundColor: '#10b981',
  },
  text: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
})
