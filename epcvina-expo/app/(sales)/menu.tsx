import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../src/lib/supabase'

type Profile = {
  full_name?: string | null
  email?: string | null
  phone?: string | null
  role?: 'admin' | 'sale_admin' | 'sale' | 'customer' | 'warehouse' | string | null
}

const COLORS = {
  background: '#f0f9ff',
  danger: '#ef4444',
  primary: '#175ead',
  primarySoft: 'rgba(23, 94, 173, 0.1)',
  primarySoft2: 'rgba(23, 94, 173, 0.05)',
  shadow: '#000',
  surface: '#ffffff',
  text: '#111827',
  textMuted: '#6b7280',
  textFaint: '#9ca3af',
  white: '#ffffff',
}

export default function MenuScreen() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setProfile(profileData as Profile | null)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await signOut()
            router.replace('/(auth)/login')
          },
        },
      ]
    )
  }

  const isAdmin = profile?.role === 'admin'
  const isSaleAdmin = profile?.role === 'sale_admin'

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'sale_admin':
        return 'Trưởng phòng'
      case 'sale':
        return 'Nhân viên bán hàng'
      default:
        return 'Nhân viên'
    }
  }

  const menuItems = [
    {
      title: 'Thông báo',
      description: 'Xem và quản lý thông báo',
      icon: 'notifications',
      color: '#175ead',
      bg: '#dbeafe',
      onPress: () => router.push('/(sales)/notifications'),
    },
    {
      title: 'Bảng giá',
      description: 'Xem giá sản phẩm và chính sách giảm giá',
      icon: 'pricetag',
      color: '#8b5cf6',
      bg: '#f3e8ff',
      onPress: () => router.push('/(sales)/pricing'),
    },
    {
      title: 'Quản lý kho hàng',
      description: 'Kiểm tra tồn kho và giá bán',
      icon: 'cube',
      color: '#f59e0b',
      bg: '#fef3c7',
      onPress: () => router.push('/(sales)/inventory'),
    },
  ]

  // Add customer assignment for sale_admin and admin
  if (isSaleAdmin || isAdmin) {
    menuItems.push({
      title: 'Gán khách hàng',
      description: 'Phân công khách hàng cho nhân viên',
      icon: 'person-add',
      color: '#10b981',
      bg: '#d1fae5',
      onPress: () => router.push('/(sales)/customers/assign'),
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Logo */}
      <View style={styles.topHeader}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoTitle}>EPCVINA</Text>
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Các tính năng bổ sung dành cho bán hàng và khách hàng</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile?.full_name || 'Người dùng'}</Text>
            <Text style={styles.userEmail}>{profile?.email || profile?.phone}</Text>
            <Text style={styles.userRole}>{getRoleLabel(profile?.role)}</Text>
          </View>
        </View>

        {/* Menu Items Grid */}
        {menuItems.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="apps" size={20} color="#175ead" />
                <Text style={styles.sectionTitle}>Tính năng bổ sung</Text>
              </View>
            </View>

            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                      <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color={item.color} />
                    </View>
                    <View style={styles.menuItemText}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      <Text style={styles.menuItemDescription} numberOfLines={1}>
                        {item.description}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>SalesApp Workspace • v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  logo: {
    height: 40,
    width: 40,
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 16,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  menuGrid: {
    gap: 12,
  },
  menuIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  menuItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuItemContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  menuItemDescription: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  pageHeader: {
    marginBottom: 8,
  },
  scrollContent: {
    gap: 20,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  topHeader: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userAvatar: {
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  userAvatarText: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userCard: {
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft2,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  userEmail: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userRole: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  version: {
    color: COLORS.textFaint,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 20,
    marginTop: 8,
    opacity: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
})
