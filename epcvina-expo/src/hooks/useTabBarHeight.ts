import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const useTabBarHeight = () => {
  const insets = useSafeAreaInsets()
  
  // Tab bar base height (60px) + safe area bottom + extra padding (24px)
  const tabBarHeight = 60 + insets.bottom
  const contentPaddingBottom = tabBarHeight + 24
  
  return {
    tabBarHeight,
    contentPaddingBottom,
    safeAreaBottom: insets.bottom,
  }
}
