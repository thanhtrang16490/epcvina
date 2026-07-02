import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

export default function AdminLayout() {
  const { user } = useAuth()
  const router = useRouter()

  // Protect admin routes
  useEffect(() => {
    if (user && user.role !== 'admin') {
      // Non-admin users should not access admin routes
      router.replace('/(sales)/dashboard')
    }
  }, [user])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ef4444', // Red for admin
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Người dùng',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Danh mục',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Phân tích',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="approvals"
        options={{
          href: null,
          title: 'Phê duyệt',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden tabs — navigated from dashboard quick actions */}
      <Tabs.Screen
        name="products"
        options={{
          href: null,
          title: 'Sản phẩm',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="brands"
        options={{
          href: null,
          title: 'Thương hiệu',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="discounts"
        options={{
          href: null,
          title: 'Chiết khấu',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetag" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gifts"
        options={{
          href: null,
          title: 'Tặng quà',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          href: null,
          title: 'Giá đặc biệt',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
