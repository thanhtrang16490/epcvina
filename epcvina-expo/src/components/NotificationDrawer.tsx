import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface NotificationDrawerProps {
  visible: boolean
  onClose: () => void
}

export default function NotificationDrawer({ visible, onClose }: NotificationDrawerProps) {
  if (!visible) return null

  return (
    <View style={styles.drawerOverlay}>
      <TouchableOpacity
        style={styles.drawerBackdrop}
        onPress={onClose}
      />
      <View style={styles.drawerContainer}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Thông báo</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.drawerContent}>
          <View style={styles.emptyNotifications}>
            <Ionicons name="notifications-off-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyNotificationsText}>Chưa có thông báo nào</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  drawerContent: {
    flex: 1,
  },
  emptyNotifications: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyNotificationsText: {
    marginTop: 16,
    fontSize: 14,
    color: '#9ca3af',
  },
})
