import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import NotificationButton from './NotificationButton'
import { APP_CONFIG } from '../constants/config'

interface AppHeaderProps {
  /** Show notification bell icon. Default: true */
  showNotification?: boolean
  /** Override the menu navigation target. Default: '/(sales)/menu' */
  menuHref?: string
  /** Show user avatar. Default: true */
  showAvatar?: boolean
}

/** Lấy 1-2 ký tự đầu từ tên người dùng để hiển thị avatar */
function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return 'U'
}

/** Màu avatar theo role */
function getAvatarColor(role?: string): string {
  switch (role) {
    case 'admin': return '#7c3aed'
    case 'sale_admin': return '#175ead'
    case 'sale': return '#0891b2'
    case 'warehouse': return '#d97706'
    case 'accountant': return '#4f46e5'
    default: return '#6b7280'
  }
}

export default function AppHeader({
  showNotification = true,
  menuHref = '/(sales)/menu',
  showAvatar = true,
}: AppHeaderProps) {
  const router = useRouter()
  const { user } = useAuth()

  const handlePhonePress = () => {
    const url = `tel:${APP_CONFIG.hotline}`
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url)
        } else {
          Alert.alert('Hotline', APP_CONFIG.hotline)
        }
      })
      .catch(() => Alert.alert('Hotline', APP_CONFIG.hotline))
  }

  const initials = getInitials(user?.full_name, user?.email)
  const avatarColor = getAvatarColor(user?.role)

  return (
    <View style={styles.topHeader}>
      {/* Logo + App name */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.logoTitle}>{APP_CONFIG.name}</Text>
          {user?.full_name && (
            <Text style={styles.greeting} numberOfLines={1}>
              Xin chào, {user.full_name.split(' ').pop()}
            </Text>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.headerActions}>
        {/* Hotline */}
        <TouchableOpacity
          style={styles.phoneButton}
          onPress={handlePhonePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Gọi hotline ${APP_CONFIG.hotline}`}
          accessibilityRole="button"
        >
          <Ionicons name="call" size={18} color="#10b981" />
        </TouchableOpacity>

        {/* Notification */}
        {showNotification && <NotificationButton userId={user?.id} />}

        {/* User Avatar → opens menu */}
        {showAvatar ? (
          <TouchableOpacity
            style={[styles.avatarButton, { backgroundColor: avatarColor }]}
            onPress={() => router.push(menuHref as any)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Mở menu người dùng"
            accessibilityRole="button"
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push(menuHref as any)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Mở menu"
            accessibilityRole="button"
          >
            <Ionicons name="menu" size={24} color="#111827" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0f2fe',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  logo: {
    width: 36,
    height: 36,
  },
  logoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  greeting: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    borderRadius: 18,
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menuButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
