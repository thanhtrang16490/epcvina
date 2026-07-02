import React, { Suspense, lazy, ComponentType } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/colors'

interface LazyComponentProps {
  fallback?: React.ReactNode
  loaderColor?: string
}

/**
 * Wrapper cho lazy loading components
 * Sử dụng React.lazy và Suspense để code splitting
 * 
 * @param importFunc - Dynamic import function
 * @param fallback - Custom fallback component
 * @param loaderColor - Loader color
 * 
 * @example
 * ```tsx
 * const LazyDashboard = createLazyComponent(
 *   () => import('./Dashboard'),
 *   <CustomLoader />
 * )
 * ```
 */
export function createLazyComponent<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode,
  loaderColor: string = COLORS.PRIMARY.DEFAULT
): ComponentType<P> {
  const LazyComponent = lazy(importFunc)

  return (props: P) => (
    <Suspense
      fallback={
        fallback || (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={loaderColor} />
          </View>
        )
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  )
}

/**
 * Default loader component
 */
export function DefaultLoader({ color = COLORS.PRIMARY.DEFAULT }: { color?: string }) {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
})
