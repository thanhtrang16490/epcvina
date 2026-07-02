import { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'

type MovementType = 'all' | 'in' | 'out'
type DateFilter = 'all' | 'week' | 'month'

interface StockMovement {
  id: string
  product_id: string
  type: 'in' | 'out'
  quantity: number
  note: string | null
  created_by: string | null
  created_at: string
  products: {
    name: string
    code: string | null
  } | null
}

interface ProfileMap {
  [key: string]: string
}

const PAGE_SIZE = 50

export default function WarehouseHistoryScreen() {
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()

  const [movements, setMovements] = useState<StockMovement[]>([])
  const [profileMap, setProfileMap] = useState<ProfileMap>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [typeFilter, setTypeFilter] = useState<MovementType>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setPage(0)
      fetchData(0, true)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeFilter, dateFilter])
  )

  const onRefresh = () => {
    setRefreshing(true)
    setPage(0)
    fetchData(0, true).finally(() => setRefreshing(false))
  }

  const getDateFilterGte = (): string | null => {
    const now = new Date()
    if (dateFilter === 'week') {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(now.setDate(diff))
      monday.setHours(0, 0, 0, 0)
      return monday.toISOString()
    }
    if (dateFilter === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      firstDay.setHours(0, 0, 0, 0)
      return firstDay.toISOString()
    }
    return null
  }

  const fetchProfiles = async (movementsData: StockMovement[]) => {
    const userIds = Array.from(
      new Set(movementsData.map((m) => m.created_by).filter(Boolean))
    ) as string[]
    if (userIds.length === 0) return

    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds)

      if (data) {
        const map: ProfileMap = {}
        data.forEach((p: { id: string; full_name: string | null }) => {
          map[p.id] = p.full_name || 'Nhân viên'
        })
        setProfileMap(map)
      }
    } catch {
      // Silently ignore profile fetch errors
    }
  }

  const fetchData = async (currentPage: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      let query = supabase
        .from('stock_movements')
        .select('*, products(name, code)')
        .order('created_at', { ascending: false })

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter)
      }

      const dateGte = getDateFilterGte()
      if (dateGte) {
        query = query.gte('created_at', dateGte)
      }

      const from = currentPage * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      query = query.range(from, to)

      const { data, error } = await query

      if (error) throw error

      const newData = (data || []) as StockMovement[]
      setHasMore(newData.length === PAGE_SIZE)

      if (reset) {
        setMovements(newData)
        await fetchProfiles(newData)
      } else {
        setMovements((prev) => [...prev, ...newData])
        await fetchProfiles(newData)
      }
    } catch (error) {
      console.error('Error fetching stock movements:', error)
      Alert.alert('Lỗi', 'Không thể tải lịch sử kho')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchData(nextPage, false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTypeBadge = (type: 'in' | 'out') => {
    if (type === 'in') {
      return { label: 'Nhập', color: '#10b981', bg: '#d1fae5', icon: 'arrow-down' as const }
    }
    return { label: 'Xuất', color: '#ef4444', bg: '#fee2e2', icon: 'arrow-up' as const }
  }

  if (loading && movements.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.navHeaderCenter}>
          <Text style={styles.navHeaderTitle}>Lịch sử kho</Text>
          <Text style={styles.navHeaderSubtitle}>
            {movements.length} bản ghi
          </Text>
        </View>
        <View style={styles.navHeaderIcon}>
          <Ionicons name="time" size={22} color="#f59e0b" />
        </View>
      </View>

      {/* Type Filter */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, typeFilter === 'all' && styles.filterChipActive]}
            onPress={() => setTypeFilter('all')}
          >
            <Text
              style={[
                styles.filterChipText,
                typeFilter === 'all' && styles.filterChipTextActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, typeFilter === 'in' && styles.filterChipActive]}
            onPress={() => setTypeFilter('in')}
          >
            <Ionicons
              name="arrow-down"
              size={14}
              color={typeFilter === 'in' ? 'white' : '#10b981'}
            />
            <Text
              style={[
                styles.filterChipText,
                typeFilter === 'in' && styles.filterChipTextActive,
              ]}
            >
              Nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, typeFilter === 'out' && styles.filterChipActive]}
            onPress={() => setTypeFilter('out')}
          >
            <Ionicons
              name="arrow-up"
              size={14}
              color={typeFilter === 'out' ? 'white' : '#ef4444'}
            />
            <Text
              style={[
                styles.filterChipText,
                typeFilter === 'out' && styles.filterChipTextActive,
              ]}
            >
              Xuất
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Filter */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.dateChip, dateFilter === 'all' && styles.dateChipActive]}
            onPress={() => setDateFilter('all')}
          >
            <Text
              style={[
                styles.dateChipText,
                dateFilter === 'all' && styles.dateChipTextActive,
              ]}
            >
              Toàn bộ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateChip, dateFilter === 'week' && styles.dateChipActive]}
            onPress={() => setDateFilter('week')}
          >
            <Text
              style={[
                styles.dateChipText,
                dateFilter === 'week' && styles.dateChipTextActive,
              ]}
            >
              Tuần này
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateChip, dateFilter === 'month' && styles.dateChipActive]}
            onPress={() => setDateFilter('month')}
          >
            <Text
              style={[
                styles.dateChipText,
                dateFilter === 'month' && styles.dateChipTextActive,
              ]}
            >
              Tháng này
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.content, { paddingBottom: contentPaddingBottom }]}>
          {movements.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Chưa có lịch sử</Text>
            </View>
          ) : (
            <>
              {movements.map((movement) => {
                const badge = getTypeBadge(movement.type)
                const sign = movement.type === 'in' ? '+' : '-'
                return (
                  <View key={movement.id} style={styles.movementCard}>
                    <View style={styles.movementHeader}>
                      <View style={styles.movementLeft}>
                        <View
                          style={[
                            styles.typeBadge,
                            { backgroundColor: badge.bg },
                          ]}
                        >
                          <Ionicons
                            name={badge.icon}
                            size={12}
                            color={badge.color}
                          />
                          <Text
                            style={[
                              styles.typeBadgeText,
                              { color: badge.color },
                            ]}
                          >
                            {badge.label}
                          </Text>
                        </View>
                        <Text style={styles.productName}>
                          {movement.products?.name || 'Không xác định'}
                        </Text>
                        {movement.products?.code && (
                          <Text style={styles.productCode}>
                            SKU: {movement.products.code}
                          </Text>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.quantity,
                          {
                            color:
                              movement.type === 'in'
                                ? '#10b981'
                                : '#ef4444',
                          },
                        ]}
                      >
                        {sign}
                        {movement.quantity}
                      </Text>
                    </View>

                    {movement.note && (
                      <View style={styles.noteRow}>
                        <Ionicons
                          name="document-text"
                          size={14}
                          color="#9ca3af"
                        />
                        <Text style={styles.noteText}>{movement.note}</Text>
                      </View>
                    )}

                    <View style={styles.movementFooter}>
                      <View style={styles.footerItem}>
                        <Ionicons
                          name="calendar"
                          size={14}
                          color="#9ca3af"
                        />
                        <Text style={styles.footerText}>
                          {formatDate(movement.created_at)}
                        </Text>
                      </View>
                      {movement.created_by && profileMap[movement.created_by] && (
                        <View style={styles.footerItem}>
                          <Ionicons
                            name="person"
                            size={14}
                            color="#9ca3af"
                          />
                          <Text style={styles.footerText}>
                            {profileMap[movement.created_by]}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )
              })}

              {/* Load More */}
              {hasMore && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={handleLoadMore}
                  disabled={loadingMore}
                  activeOpacity={0.7}
                >
                  {loadingMore ? (
                    <ActivityIndicator size="small" color="#f59e0b" />
                  ) : (
                    <Text style={styles.loadMoreText}>Tải thêm</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fffbeb',
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  navHeaderCenter: {
    flex: 1,
  },
  navHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  navHeaderSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  navHeaderIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fef3c7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fffbeb',
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
    gap: 10,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  filterChipTextActive: {
    color: 'white',
  },
  dateChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  dateChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  dateChipTextActive: {
    color: 'white',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  movementCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  movementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  movementLeft: {
    flex: 1,
    marginRight: 12,
    gap: 6,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  productCode: {
    fontSize: 12,
    color: '#9ca3af',
  },
  quantity: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginBottom: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
  },
  movementFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  loadMoreButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f59e0b',
    alignItems: 'center',
    marginTop: 4,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
})
