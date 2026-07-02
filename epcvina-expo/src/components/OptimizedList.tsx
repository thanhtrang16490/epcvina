import { FlatList, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { memo, useCallback } from 'react'

interface OptimizedListProps<T> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactElement
  keyExtractor: (item: T, index: number) => string
  loading?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  onEndReached?: () => void
  onEndReachedThreshold?: number
  ListEmptyComponent?: React.ReactElement
  ListHeaderComponent?: React.ReactElement
  ListFooterComponent?: React.ReactElement
  estimatedItemSize?: number
  horizontal?: boolean
  numColumns?: number
  contentContainerStyle?: any
}

function OptimizedListComponent<T>({
  data,
  renderItem,
  keyExtractor,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  onEndReachedThreshold = 0.5,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  estimatedItemSize = 100,
  horizontal = false,
  numColumns,
  contentContainerStyle,
}: OptimizedListProps<T>) {
  
  const renderItemCallback = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem]
  )

  const renderFooter = () => {
    if (ListFooterComponent) return ListFooterComponent
    
    if (loading && data.length > 0) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text style={styles.footerText}>Đang tải thêm...</Text>
        </View>
      )
    }
    return null
  }

  const renderEmpty = () => {
    if (loading && data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.emptyText}>Đang tải...</Text>
        </View>
      )
    }

    if (ListEmptyComponent) return ListEmptyComponent

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItemCallback}
      keyExtractor={keyExtractor}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      getItemLayout={
        estimatedItemSize
          ? (data, index) => ({
              length: estimatedItemSize,
              offset: estimatedItemSize * index,
              index,
            })
          : undefined
      }
      // Refresh control
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      // Infinite scroll
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      // Components
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      // Layout
      horizontal={horizontal}
      numColumns={numColumns}
      contentContainerStyle={[
        styles.contentContainer,
        data.length === 0 && styles.emptyContentContainer,
        contentContainerStyle,
      ]}
    />
  )
}

// Export memoized version
export const OptimizedList = memo(OptimizedListComponent) as typeof OptimizedListComponent

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  emptyContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
})
