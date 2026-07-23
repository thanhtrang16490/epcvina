import { Stack, router } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { AuthProvider, useAuth } from '../src/contexts/AuthContext'
import ErrorBoundary from '../src/components/ErrorBoundary'
import OfflineBanner from '../src/components/OfflineBanner'
import { useEffect } from 'react'
import { OfflineManager } from '../src/lib/offline-manager'
import { Analytics } from '../src/lib/analytics'
import { initDeepLinking } from '../src/lib/deep-linking'
import { errorTracker } from '../src/lib/error-tracking'
import { usePushNotifications } from '../src/hooks/usePushNotifications'

/**
 * React Query client configuration.
 * - staleTime: data is fresh for 2 minutes before background refetch
 * - retry: retry failed requests up to 2 times
 * - refetchOnWindowFocus: disabled (mobile apps don't have window focus events)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

/**
 * Inner component có thể dùng hooks (cần nằm trong AuthProvider)
 */
function AppContent() {
  const { user } = useAuth()

  // Khởi tạo push notifications khi user đăng nhập
  usePushNotifications({
    userId: user?.id,
    onNotificationTap: (data) => {
      // Điều hướng dựa trên notification data
      if (data?.screen) {
        try {
          router.push(data.screen as any)
        } catch {
          // Silently fail nếu route không hợp lệ
        }
      }
    },
  })

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="system-advisor" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(sales)" />
        <Stack.Screen name="(warehouse)" />
      </Stack>
      <OfflineBanner />
    </View>
  )
}

export default function RootLayout() {
  useEffect(() => {
    // Initialize services
    errorTracker.init()
    Analytics.initialize()

    // Initialize offline manager (non-blocking)
    OfflineManager.initialize().catch(err => {
      errorTracker.logError(err, { action: 'RootLayout.initOfflineManager' })
    })

    // Initialize deep linking
    const cleanupDeepLinking = initDeepLinking()

    return () => {
      cleanupDeepLinking()
    }
  }, [])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
