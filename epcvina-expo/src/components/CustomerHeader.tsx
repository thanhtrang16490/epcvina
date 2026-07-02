import { View, Text, Image, StyleSheet } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import NotificationButton from './NotificationButton'

interface CustomerHeaderProps {
  showNotification?: boolean
}

export default function CustomerHeader({ 
  showNotification = true
}: CustomerHeaderProps) {
  const { user } = useAuth()

  return (
    <View style={styles.topHeader}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoTitle}>APPE JV</Text>
      </View>
      <View style={styles.headerActions}>
        {showNotification && <NotificationButton userId={user?.id} color="#10b981" />}
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
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})
