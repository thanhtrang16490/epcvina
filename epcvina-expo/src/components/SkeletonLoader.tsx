import { View, StyleSheet, Animated, Easing } from 'react-native'
import { useEffect, useRef } from 'react'

interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  style?: any
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 4, style }: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.productCard}>
      <Skeleton width="100%" height={120} borderRadius={8} />
      <View style={styles.productInfo}>
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
        <View style={styles.productFooter}>
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={20} borderRadius={10} />
        </View>
      </View>
    </View>
  )
}

export function OrderCardSkeleton() {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderLeft}>
          <Skeleton width={40} height={40} borderRadius={12} />
          <View style={styles.orderInfo}>
            <Skeleton width={120} height={16} style={{ marginBottom: 6 }} />
            <Skeleton width={100} height={12} style={{ marginBottom: 6 }} />
            <Skeleton width={80} height={12} />
          </View>
        </View>
        <Skeleton width={80} height={20} />
      </View>
      <View style={styles.orderActions}>
        <Skeleton width="48%" height={36} borderRadius={8} />
        <Skeleton width="48%" height={36} borderRadius={8} />
      </View>
    </View>
  )
}

export function StatCardSkeleton() {
  return (
    <View style={styles.statCard}>
      <Skeleton width={40} height={40} borderRadius={10} style={{ marginBottom: 12 }} />
      <Skeleton width="60%" height={24} style={{ marginBottom: 4 }} />
      <Skeleton width="80%" height={14} />
    </View>
  )
}

export function ListSkeleton({ count = 3, type = 'order' }: { count?: number; type?: 'order' | 'product' | 'stat' }) {
  const SkeletonComponent = 
    type === 'product' ? ProductCardSkeleton :
    type === 'stat' ? StatCardSkeleton :
    OrderCardSkeleton

  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </View>
  )
}

/**
 * Skeleton cho toàn bộ màn hình Dashboard
 */
export function DashboardSkeleton() {
  return (
    <View style={styles.dashboardContainer}>
      {/* Filter tabs skeleton */}
      <View style={styles.filterRow}>
        {[80, 90, 100, 80, 60].map((w, i) => (
          <Skeleton key={i} width={w} height={32} borderRadius={16} />
        ))}
      </View>

      {/* Stats cards skeleton */}
      <View style={styles.statsSection}>
        <Skeleton width={80} height={18} style={{ marginBottom: 12 }} />
        <View style={styles.statsRow}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.statCardSkeleton}>
              <Skeleton width={40} height={40} borderRadius={10} style={{ marginBottom: 10 }} />
              <Skeleton width="70%" height={20} style={{ marginBottom: 6 }} />
              <Skeleton width="90%" height={13} />
            </View>
          ))}
        </View>
      </View>

      {/* Quick actions skeleton */}
      <View style={styles.actionsSection}>
        <Skeleton width={100} height={18} style={{ marginBottom: 12 }} />
        <View style={styles.actionsRow}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.actionCardSkeleton}>
              <Skeleton width={48} height={48} borderRadius={24} style={{ marginBottom: 8 }} />
              <Skeleton width="80%" height={12} />
            </View>
          ))}
        </View>
      </View>

      {/* Recent orders skeleton */}
      <View style={styles.ordersSection}>
        <Skeleton width={120} height={18} style={{ marginBottom: 12 }} />
        <ListSkeleton count={3} type="order" />
      </View>
    </View>
  )
}

/**
 * Skeleton cho màn hình Orders list
 */
export function OrdersListSkeleton() {
  return (
    <View style={styles.dashboardContainer}>
      {/* Tab bar skeleton */}
      <View style={styles.filterRow}>
        {[60, 80, 80, 80, 90].map((w, i) => (
          <Skeleton key={i} width={w} height={36} borderRadius={8} />
        ))}
      </View>
      {/* Order cards */}
      <ListSkeleton count={5} type="order" />
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e5e7eb',
  },
  listContainer: {
    gap: 12,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    marginTop: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  orderInfo: {
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  // Dashboard skeleton styles
  dashboardContainer: {
    padding: 16,
    gap: 24,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statsSection: {
    gap: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCardSkeleton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionsSection: {
    gap: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCardSkeleton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  ordersSection: {
    gap: 0,
  },
})
