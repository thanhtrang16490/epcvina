import React from 'react'
import { render, waitFor } from '@testing-library/react-native'

// ── Mock auth context ──
jest.mock('../../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-sale-id', email: 'sale@test.com', role: 'sale' },
    session: { access_token: 'mock-token' },
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
    refreshUser: jest.fn(),
  }),
}))

// ── Mock expo-router ──
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
  useFocusEffect: jest.fn(),
  usePathname: () => '/(sales)/dashboard',
  Stack: { Screen: 'Screen' },
  Tabs: { Screen: 'Screen' },
}))

// ── Mock safe-area-context ──
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

// ── Mock useTabBarHeight ──
jest.mock('../../../src/hooks/useTabBarHeight', () => ({
  useTabBarHeight: () => ({ tabBarHeight: 84, contentPaddingBottom: 108, safeAreaBottom: 0 }),
}))

// ── Mock _layout emitScrollVisibility ──
jest.mock('../_layout', () => ({
  emitScrollVisibility: jest.fn(),
}))

// ── Mock feature-flags ──
jest.mock('../../../src/lib/feature-flags', () => ({
  hasSaleAdminDashboard: jest.fn(() => false),
  hasTeamFeatures: jest.fn(() => false),
  hasTeamReports: jest.fn(() => false),
  featureFlags: {
    enableSaleAdminDashboard: false,
    enableTeamManagement: false,
  },
}))

// ── Mock dashboard components (use require() to avoid out-of-scope variables) ──
jest.mock('../../../src/components/dashboard', () => {
  const { View, Text } = require('react-native')
  return {
    DashboardStats: ({ stats }: any) => (
      <View testID="dashboard-stats">
        <Text>Đơn hàng: {stats?.orderedCount ?? 0}</Text>
      </View>
    ),
    QuickActions: () => <View testID="quick-actions"><Text>Quick Actions</Text></View>,
    RecentOrders: () => <View testID="recent-orders"><Text>Recent Orders</Text></View>,
    TimeRangeFilter: () => <View testID="time-range-filter"><Text>Time Range</Text></View>,
    TimeRangeModal: () => <View testID="time-range-modal"><Text>Time Range Modal</Text></View>,
  }
})

// ── Mock SkeletonLoader ──
jest.mock('../../../src/components/SkeletonLoader', () => {
  const { View, Text } = require('react-native')
  return {
    DashboardSkeleton: () => <View testID="dashboard-skeleton"><Text>Loading...</Text></View>,
  }
})

// ── Mock RevenueChart ──
jest.mock('../../../src/components/dashboard/RevenueChart', () => {
  const { View, Text } = require('react-native')
  return function MockRevenueChart() {
    return <View testID="revenue-chart"><Text>Revenue Chart</Text></View>
  }
})

// ── Mock AppHeader ──
jest.mock('../../../src/components/AppHeader', () => {
  const { View, Text } = require('react-native')
  return function MockAppHeader() {
    return <View testID="app-header"><Text>App Header</Text></View>
  }
})

// ── Mock NotificationButton ──
jest.mock('../../../src/components/NotificationButton', () => {
  const { View, Text } = require('react-native')
  return function MockNotificationButton() {
    return <View testID="notification-button"><Text>Notifications</Text></View>
  }
})

// ── Mock constants ──
jest.mock('../../../src/constants/colors', () => ({
  COLORS: {
    PRIMARY: { DEFAULT: '#175ead', LIGHT: '#dbeafe', DARK: '#0c3d6e' },
    SECONDARY: { DEFAULT: '#f59e0b', LIGHT: '#fef3c7', DARK: '#92400e' },
    SUCCESS: { DEFAULT: '#10b981', LIGHT: '#d1fae5' },
    DANGER: { DEFAULT: '#ef4444', LIGHT: '#fee2e2' },
    GRAY: {
      50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
      400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
      800: '#1f2937', 900: '#111827',
    },
  },
}))

import DashboardScreen from '../dashboard'

describe('Sales Dashboard', () => {
  it('renders without crashing', () => {
    // Component initially shows skeleton loader while fetching data
    const { getByText } = render(<DashboardScreen />)
    expect(getByText('Loading...')).toBeTruthy()
  })

  it('renders app header after loading', async () => {
    const { findByTestId } = render(<DashboardScreen />)
    // waitFor async fetchData to complete and show main content
    const header = await findByTestId('app-header')
    expect(header).toBeTruthy()
  })
})
