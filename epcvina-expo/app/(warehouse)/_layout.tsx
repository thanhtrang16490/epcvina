import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Use scroll event emitter from sales layout
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

export default function WarehouseLayout() {
  const translateY = useRef(new Animated.Value(0)).current
  const insets = useSafeAreaInsets()

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

  const tabBarHeight = 60 + insets.bottom

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f59e0b',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
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
          title: 'Tổng quan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "grid" : "grid-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Đơn chờ xuất',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "cube" : "cube-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Sản phẩm',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "pricetags" : "pricetags-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Báo cáo',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stock-in"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="production"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}
