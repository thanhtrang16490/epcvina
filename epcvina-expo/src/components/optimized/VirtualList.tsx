import React, { memo, useCallback } from 'react'
import { FlatList, FlatListProps, View, Text, StyleSheet } from 'react-native'
import { LAYOUT } from '../../constants/layout'

const { PADDING: SPACING } = LAYOUT

interface VirtualListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactElement
  keyExtractor: (item: T, index: number) => string
  emptyMessage?: string
  estimatedItemSize?: number
}

/**
 * Optimized Virtual List component
 * Sử dụng FlatList với các optimizations:
 * - windowSize optimization
 * - removeClippedSubviews
 * - maxToRenderPerBatch
 * - updateCellsBatchingPeriod
 * - initialNumToRender
 * - getItemLayout (nếu có estimatedItemSize)
 * 
 * @param data - Array of items
 * @param renderItem - Function để render mỗi item
 * @param keyExtractor - Function để extract unique key
 * @param emptyMessage - Message khi list empty
 * @param estimatedItemSize - Estimated height của mỗi item (để optimize getItemLayout)
 * 
 * @example
 * ```tsx
 * <VirtualList
 *   data={products}
 *   renderItem={(product) => <ProductCard product={product} />}
 *   keyExtractor={(product) => product.id}
 *   estimatedItemSize={100}
 * />
 * ```
 */
function VirtualListComponent<T>({
  data,
  renderItem,
  keyExtractor,
  emptyMessage = 'Không có dữ liệu',
  estimatedItemSize,
  ...props
}: VirtualListProps<T>) {
  /**
   * Memoized render function
   */
  const memoizedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      return renderItem(item, index)
    },
    [renderItem]
  )

  /**
   * getItemLayout optimization
   * Chỉ sử dụng nếu có estimatedItemSize và items có fixed height
   */
  const getItemLayout = estimatedItemSize
    ? (_data: any, index: number) => ({
        length: estimatedItemSize,
        offset: estimatedItemSize * index,
        index,
      })
    : undefined

  /**
   * Empty component
   */
  const renderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    )
  }, [emptyMessage])

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={renderEmptyComponent}
      getItemLayout={getItemLayout}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={5}
      // Prevent unnecessary re-renders
      extraData={data}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XLARGE,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
})

/**
 * Memoized version
 */
export const VirtualList = memo(VirtualListComponent) as typeof VirtualListComponent
