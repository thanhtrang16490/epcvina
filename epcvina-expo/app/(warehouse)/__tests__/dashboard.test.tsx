import React from 'react'
import { render, waitFor } from '@testing-library/react-native'

// ── Mock auth context ──
jest.mock('../../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-warehouse-id', email: 'warehouse@test.com', role: 'warehouse' },
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
  usePathname: () => '/(warehouse)/dashboard',
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

import WarehouseDashboard from '../dashboard'

describe('Warehouse Dashboard', () => {
  it('renders without crashing', () => {
    // Component initially shows loading state
    const { getByText } = render(<WarehouseDashboard />)
    expect(getByText('Đang tải...')).toBeTruthy()
  })

  it('renders app header after loading', async () => {
    const { findByTestId } = render(<WarehouseDashboard />)
    const header = await findByTestId('app-header', {}, { timeout: 3000 })
    expect(header).toBeTruthy()
  })
})
