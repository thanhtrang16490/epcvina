import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../src/lib/supabase'
import { hasTeamFeatures } from '../../src/lib/feature-flags'

export default function MenuScreen() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
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

  const adminMenuItems = []

  if (isAdmin || isSaleAdmin) {
    // Add Team Management for sale_admin
    if (isSaleAdmin) {
      adminMenuItems.push({
        title: 'Quản lý Team',
        description: 'Xem và quản lý thành viên trong team',
        icon: 'people-circle',
        color: '#175ead',
        bg: '#dbeafe',
        onPress: () => router.push('/(sales)/team' as any),
      })
    }

    adminMenuItems.push(
      {
        title: 'Phân tích dữ liệu',
        description: 'Analytics và insights chi tiết',
        icon: 'analytics',
        color: '#8b5cf6',
        bg: '#f3e8ff',
        onPress: () => router.push('/(sales)/analytics'),
      },
      {
        title: 'Quản lý danh mục',
        description: 'Tạo và chỉnh sửa danh mục sản phẩm',
        icon: 'folder',
        color: '#f59e0b',
        bg: '#fef3c7',
        onPress: () => router.push('/(sales)/categories'),
      },
      {
        title: 'Xuất dữ liệu',
        description: 'Export CSV/Excel cho báo cáo',
        icon: 'download',
        color: '#10b981',
        bg: '#d1fae5',
        onPress: () => router.push('/(sales)/export'),
      },
      {
        title: 'Quản lý nhân sự',
        description: 'Quản lý tài khoản và phân quyền',
        icon: 'shield-checkmark',
        color: '#ef4444',
        bg: '#fee2e2',
        onPress: () => router.push('/(sales)/users'),
      }
    )
  }

  if (isAdmin) {
    adminMenuItems.push({
      title: 'Cài đặt hệ thống',
      description: 'Cấu hình và tùy chỉnh hệ thống',
      icon: 'settings',
      color: '#6b7280',
      bg: '#f3f4f6',
      onPress: () => router.push('/(sales)/settings'),
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
          <Text style={styles.logoTitle}>APPE JV</Text>
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
          <Text style={styles.subtitle}>Các tính năng bổ sung và công cụ quản trị</Text>
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
                      <Ionicons name={item.icon as any} size={24} color={item.color} />
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

        {/* Admin Tools Section */}
        {(isAdmin || isSaleAdmin) && adminMenuItems.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="shield-checkmark" size={20} color="#175ead" />
                <Text style={styles.sectionTitle}>Công cụ quản trị</Text>
              </View>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>
                  {isAdmin ? 'ADMIN' : 'SALE ADMIN'}
                </Text>
              </View>
            </View>

            <View style={styles.menuGrid}>
              {adminMenuItems.map((item, index) => (
                <TouchableOpacity
                  key={`admin-${index}`}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                      <Ionicons name={item.icon as any} size={24} color={item.color} />
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
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
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
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  pageHeader: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  userCard: {
    backgroundColor: 'rgba(23, 94, 173, 0.05)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(23, 94, 173, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#175ead',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#175ead',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuGrid: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  adminBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#175ead',
    letterSpacing: 0.5,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.5,
    marginTop: 8,
    marginBottom: 20,
  },
})
