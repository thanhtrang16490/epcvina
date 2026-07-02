// Fix React 19 compatibility with @testing-library/react-native v12
// 1. Set act environment flag
global.IS_REACT_ACT_ENVIRONMENT = true

// 2. Patch react-test-renderer to use React 19's act()
//    (react-test-renderer's act export changed in React 19)
jest.mock('react-test-renderer', () => {
  const actual = jest.requireActual('react-test-renderer')
  const { act } = require('react')
  return {
    ...actual,
    act: typeof act === 'function' ? act : actual.act,
  }
})

// 3. Patch ReactCurrentOwner for older internals access
const React = require('react')
const internals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
if (internals && !internals.ReactCurrentOwner) {
  internals.ReactCurrentOwner = { current: null }
} else if (!internals) {
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = { ReactCurrentOwner: { current: null } }
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
  useNetInfo: jest.fn(() => ({ isConnected: true, isInternetReachable: true })),
  NetInfoStateType: {
    unknown: 'unknown',
    none: 'none',
    cellular: 'cellular',
    wifi: 'wifi',
    bluetooth: 'bluetooth',
    ethernet: 'ethernet',
    wimax: 'wimax',
    vpn: 'vpn',
    other: 'other',
  },
}))

// Mock expo-modules-core (required by @expo/vector-icons and other Expo packages)
jest.mock('expo-modules-core', () => ({
  EventEmitter: class EventEmitter {
    addListener = jest.fn(() => ({ remove: jest.fn() }))
    removeAllListeners = jest.fn()
    emit = jest.fn()
  },
  NativeModulesProxy: {},
  requireNativeModule: jest.fn(() => ({})),
  requireOptionalNativeModule: jest.fn(() => null),
  Platform: { OS: 'ios' },
}))

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native')
  const MockIcon = ({ name, size, color, style }) =>
    require('react').createElement(Text, { style: [{ fontSize: size, color }, style] }, name)
  return {
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
    FontAwesome: MockIcon,
    FontAwesome5: MockIcon,
    AntDesign: MockIcon,
    Feather: MockIcon,
    Entypo: MockIcon,
    MaterialCommunityIcons: MockIcon,
  }
})

// Mock expo-font (dependency of @expo/vector-icons)
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
  isLoading: jest.fn(() => false),
}))

// Mock Expo modules
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useFocusEffect: jest.fn(),
  Stack: {
    Screen: 'Screen',
  },
  Tabs: {
    Screen: 'Screen',
  },
}))

// Mock Supabase
jest.mock('./src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}))

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
}
