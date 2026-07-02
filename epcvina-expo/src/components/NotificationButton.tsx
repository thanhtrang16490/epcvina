import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'

type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'order' | 'inventory' | 'customer' | 'system'
  read: boolean
  created_at: string
}

interface NotificationButtonProps {
  userId?: string
  color?: string // Primary color for the component
}

// Helper function to format time without date-fns
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

export default function NotificationButton({ userId, color = '#175ead' }: NotificationButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchNotifications()

      // Set up real-time subscription
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          },
          () => {
            fetchNotifications()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [userId])

  const fetchNotifications = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      )
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      setNotifications(prev => prev.filter(notif => notif.id !== id))
    } catch (error) {
      console.error('Error deleting notification:', error)
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
      default: return color // Use prop color
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

  const formatTime = (timestamp: string) => {
    return formatTimeAgo(timestamp)
  }

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsOpen(true)}
      >
        <Ionicons name="notifications-outline" size={24} color="#111827" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modal}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: color }]}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Ionicons name="notifications" size={20} color="white" />
                <Text style={styles.headerTitle}>Thông báo</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerSubtitle}>
              {unreadCount > 0 ? `${unreadCount} thông báo mới` : 'Không có thông báo mới'}
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[
                styles.tab, 
                activeTab === 'all' && [styles.tabActive, { borderBottomColor: color }]
              ]}
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && { color }]}>
                Tất cả ({notifications.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab, 
                activeTab === 'unread' && [styles.tabActive, { borderBottomColor: color }]
              ]}
              onPress={() => setActiveTab('unread')}
            >
              <Text style={[styles.tabText, activeTab === 'unread' && { color }]}>
                Chưa đọc ({unreadCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.markAllButton}
                onPress={markAllAsRead}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color={color} />
                <Text style={[styles.markAllText, { color }]}>Đánh dấu tất cả đã đọc</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          <ScrollView style={styles.list}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={color} />
              </View>
            ) : filteredNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-outline" size={48} color="#d1d5db" />
                <Text style={styles.emptyText}>
                  {activeTab === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo nào'}
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
                        styles.notificationItem,
                        !notification.read && styles.notificationItemUnread
                      ]}
                      onPress={() => markAsRead(notification.id)}
                    >
                      <View style={styles.notificationContent}>
                        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                          <Ionicons name={iconName} size={16} color={iconColor} />
                        </View>
                        <View style={styles.notificationBody}>
                          <View style={styles.notificationHeader}>
                            <Text style={[
                              styles.notificationTitle,
                              !notification.read && styles.notificationTitleUnread
                            ]}>
                              {notification.title}
                            </Text>
                            <View style={styles.notificationActions}>
                              {!notification.read && (
                                <View style={[styles.unreadDot, { backgroundColor: color }]} />
                              )}
                              <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                              >
                                <Ionicons name="trash-outline" size={14} color="#9ca3af" />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Text style={styles.notificationMessage} numberOfLines={2}>
                            {notification.message}
                          </Text>
                          <View style={styles.notificationFooter}>
                            <Ionicons name="time-outline" size={10} color="#9ca3af" />
                            <Text style={styles.notificationTime}>
                              {formatTime(notification.created_at)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'inherit', // Will use inline style
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: 'transparent', // Will be overridden by inline style
    backgroundColor: '#f0f9ff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  actionBar: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: 'white',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'inherit', // Will use inline style
  },
  list: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: 64,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  notificationsList: {
    padding: 12,
    gap: 8,
  },
  notificationItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 10,
  },
  notificationItemUnread: {
    backgroundColor: '#f0f9ff',
  },
  notificationContent: {
    flexDirection: 'row',
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
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
    gap: 8,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
    lineHeight: 16,
  },
  notificationTitleUnread: {
    fontWeight: 'bold',
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'inherit', // Will use inline style
  },
  deleteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationMessage: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
  },
})
