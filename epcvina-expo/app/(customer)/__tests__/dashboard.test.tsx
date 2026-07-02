import React from 'react'
import { render, waitFor } from '@testing-library/react-native'

// ── Mock auth context ──
jest.mock('../../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-customer-id', email: 'customer@test.com', role: 'customer' },
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
  usePathname: () => '/(customer)/dashboard',
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

// ── Mock customer-helper ──
jest.mock('../../../src/lib/customer-helper', () => ({
  getOrCreateCustomer: jest.fn(() => Promise.resolve('mock-customer-id')),
}))

// ── Mock error-tracking ──
jest.mock('../../../src/lib/error-tracking', () => ({
  errorTracker: {
    logError: jest.fn(),
    logWarning: jest.fn(),
    logInfo: jest.fn(),
  },
}))

// ── Mock CustomerHeader ──
jest.mock('../../../src/components/CustomerHeader', () => {
  const { View, Text } = require('react-native')
  return function MockCustomerHeader() {
    return <View testID="customer-header"><Text>Customer Header</Text></View>
  }
})

// ── Mock StatusBadge ──
jest.mock('../../../src/components/shared/StatusBadge', () => {
  const { View, Text } = require('react-native')
  return function MockStatusBadge({ status }: any) {
    return <View testID="status-badge"><Text>{status}</Text></View>
  }
})

// ── Mock NotificationButton ──
jest.mock('../../../src/components/NotificationButton', () => {
  const { View, Text } = require('react-native')
  return function MockNotificationButton() {
    return <View testID="notification-button"><Text>Notifications</Text></View>
  }
})

import CustomerDashboard from '../dashboard'

describe('Customer Dashboard', () => {
  it('renders without crashing', () => {
    // Component initially shows loading state
    const { getByText } = render(<CustomerDashboard />)
    expect(getByText('Đang tải...')).toBeTruthy()
  })

  it('renders customer header after loading', async () => {
    const { findByTestId } = render(<CustomerDashboard />)
    const header = await findByTestId('customer-header', {}, { timeout: 3000 })
    expect(header).toBeTruthy()
  })
})
