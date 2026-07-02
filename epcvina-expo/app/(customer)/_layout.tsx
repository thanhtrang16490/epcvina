import { Tabs, usePathname } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Platform } from 'react-native'
import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Create a global event emitter for scroll events
let scrollListeners: ((visible: boolean) => void)[] = []

export const emitScrollVisibility = (visible: boolean) => {
  scrollListeners.forEach(listener => listener(visible))
}

export const subscribeToScroll = (listener: (visible: boolean) => void) => {
  scrollListeners.push(listener)
  return () => {
    scrollListeners = scrollListeners.filter(l => l !== listener)
  }
}

export default function CustomerLayout() {
  const pathname = usePathname()
  const translateY = useRef(new Animated.Value(0)).current
  const insets = useSafeAreaInsets()

  // Hide bottom nav on selling page
  const shouldHideTabBar = pathname.includes('/selling')

  useEffect(() => {
    const unsubscribe = subscribeToScroll((visible) => {
      Animated.spring(translateY, {
        toValue: visible ? 0 : 100,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start()
    })

    return unsubscribe
  }, [])

  // Reset tab bar visibility when route changes
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start()
  }, [pathname])

  // Calculate tab bar height with safe area
  const tabBarHeight = 60 + insets.bottom

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: shouldHideTabBar ? { display: 'none' } : {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
          transform: [{ translateY }],
        } as any,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Sản phẩm',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="selling"
        options={{
          title: 'Đặt hàng',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
