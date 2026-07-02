import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'

type NotificationItem = {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'order' | 'inventory' | 'customer' | 'system'
  read: boolean
  created_at: string
}

type FilterTab = 'all' | 'unread' | 'read'

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
  { id: 'read', label: 'Đã đọc' },
]

// Helper: relative time in Vietnamese
const formatTimeAgo = (timestamp: string): string => {
  try {
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now.getTime() - past.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return 'vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`
    return `${Math.floor(diffDays / 365)} năm trước`
  } catch {
    return 'vừa xong'
  }
}

const getIcon = (type: string, category: string): keyof typeof Ionicons.glyphMap => {
  if (category === 'order') return 'cart'
  if (category === 'inventory') return 'cube'
  if (category === 'customer') return 'people'
  switch (type) {
    case 'success': return 'checkmark-circle'
    case 'warning': return 'warning'
    case 'error': return 'alert-circle'
    default: return 'information-circle'
  }
}

const getIconColor = (type: string) => {
  switch (type) {
    case 'success': return '#10b981'
    case 'warning': return '#f59e0b'
    case 'error': return '#ef4444'
    default: return '#175ead'
  }
}

const getBgColor = (type: string) => {
  switch (type) {
    case 'success': return '#d1fae5'
    case 'warning': return '#fef3c7'
    case 'error': return '#fee2e2'
    default: return '#dbeafe'
  }
}

export default function NotificationsScreen() {
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      fetchNotifications()
    }, [])
  )

  useEffect(() => {
    // Set up real-time subscription
    if (!userId) return
    const channel = supabase
      .channel('notifications-screen')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      setUserId(authUser.id)

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchNotifications().finally(() => setRefreshing(false))
  }

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!userId) return
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = (id: string) => {
    Alert.alert('Xóa thông báo', 'Bạn có chắc muốn xóa thông báo này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await supabase.from('notifications').delete().eq('id', id)
            setNotifications(prev => prev.filter(n => n.id !== id))
          } catch (error) {
            console.error('Error deleting notification:', error)
          }
        },
      },
    ])
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read
    if (activeFilter === 'read') return n.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    if (currentScrollY > 50) {
      emitScrollVisibility(false)
    } else {
      emitScrollVisibility(true)
    }
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#175ead" />
          <Text style={styles.loadingText}>Đang tải thông báo...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <AppHeader />

        {/* Page Header */}
        <View style={styles.pageHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Thông báo</Text>
              <Text style={styles.headerSubtitle}>
                {unreadCount > 0
                  ? `${unreadCount} thông báo chưa đọc`
                  : 'Không có thông báo mới'}
              </Text>
            </View>
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  style={styles.markAllButton}
                  onPress={markAllAsRead}
                >
                  <Ionicons name="checkmark-done" size={18} color="#175ead" />
                  <Text style={styles.markAllText}>Đọc tất cả</Text>
                </TouchableOpacity>
              )}
              <View style={styles.headerIcon}>
                <Ionicons name="notifications" size={22} color="#175ead" />
              </View>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterTab,
                  activeFilter === tab.id && styles.filterTabActive,
                ]}
                onPress={() => setActiveFilter(tab.id)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === tab.id && styles.filterTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {tab.id === 'unread' && unreadCount > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications List */}
        <View style={[styles.listContainer, { paddingBottom: contentPaddingBottom }]}>
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={56} color="#d1d5db" />
              <Text style={styles.emptyTitle}>Không có thông báo</Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'unread'
                  ? 'Bạn đã đọc tất cả thông báo'
                  : activeFilter === 'read'
                  ? 'Chưa có thông báo nào đã đọc'
                  : 'Khi có thông báo mới, nó sẽ xuất hiện ở đây'}
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {filteredNotifications.map((notification) => {
                const iconName = getIcon(notification.type, notification.category)
                const iconColor = getIconColor(notification.type)
                const bgColor = getBgColor(notification.type)

                return (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationCard,
                      !notification.read && styles.notificationCardUnread,
                    ]}
                    onPress={() => markAsRead(notification.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notificationContent}>
                      {/* Icon */}
                      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                        <Ionicons name={iconName} size={18} color={iconColor} />
                      </View>

                      {/* Body */}
                      <View style={styles.notificationBody}>
                        <View style={styles.notificationHeader}>
                          <Text
                            style={[
                              styles.notificationTitle,
                              !notification.read && styles.notificationTitleBold,
                            ]}
                            numberOfLines={1}
                          >
                            {notification.title}
                          </Text>
                          <View style={styles.notificationActions}>
                            {!notification.read && <View style={styles.unreadDot} />}
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => deleteNotification(notification.id)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Ionicons name="trash-outline" size={16} color="#9ca3af" />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <Text style={styles.notificationMessage} numberOfLines={2}>
                          {notification.message}
                        </Text>
                        <View style={styles.notificationFooter}>
                          <Ionicons name="time-outline" size={12} color="#9ca3af" />
                          <Text style={styles.notificationTime}>
                            {formatTimeAgo(notification.created_at)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  pageHeader: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#175ead',
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterTabActive: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationsList: {
    gap: 10,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationCardUnread: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 3,
    borderLeftColor: '#175ead',
  },
  notificationContent: {
    flexDirection: 'row',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBody: {
    flex: 1,
    gap: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationTitle: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    paddingRight: 8,
  },
  notificationTitleBold: {
    fontWeight: 'bold',
    color: '#111827',
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#175ead',
  },
  deleteButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
})
