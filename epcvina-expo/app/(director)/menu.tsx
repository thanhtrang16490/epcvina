import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../src/lib/supabase'

const ROSE = '#f43f5e'
const ROSE_LIGHT = '#fff1f2'

export default function DirectorMenu() {
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'director': return 'Giám đốc'
      case 'admin': return 'Quản trị viên'
      default: return 'Nhân viên'
    }
  }

  const menuItems = [
    {
      title: 'Tổng quan',
      description: 'Dashboard và chỉ số KPI',
      icon: 'bar-chart',
      color: ROSE,
      bg: '#ffe4e6',
      onPress: () => router.push('/(director)/dashboard'),
    },
    {
      title: 'Báo cáo',
      description: 'Doanh thu, công nợ, hiệu suất',
      icon: 'document-text',
      color: '#d97706',
      bg: '#fef3c7',
      onPress: () => router.push('/(director)/reports'),
    },
    {
      title: 'Xu hướng',
      description: 'So sánh và phân tích tăng trưởng',
      icon: 'trending-up',
      color: '#7c3aed',
      bg: '#f3e8ff',
      onPress: () => router.push('/(director)/trends'),
    },
  ]

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
          <Text style={styles.subtitle}>Quản lý và điều hành doanh nghiệp</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'G'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile?.full_name || 'Giám đốc'}</Text>
            <Text style={styles.userEmail}>{profile?.email || profile?.phone}</Text>
            <View style={styles.roleBadge}>
              <Ionicons name="ribbon" size={12} color={ROSE} />
              <Text style={styles.roleBadgeText}>{getRoleLabel(profile?.role || 'director')}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="navigate" size={20} color={ROSE} />
            <Text style={styles.sectionTitle}>Điều hướng</Text>
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

        {/* Settings Link */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="settings" size={20} color="#6b7280" />
            <Text style={styles.sectionTitle}>Cài đặt</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemContent}>
            <View style={[styles.menuIcon, { backgroundColor: '#f3f4f6' }]}>
              <Ionicons name="settings-outline" size={24} color="#6b7280" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Cài đặt ứng dụng</Text>
              <Text style={styles.menuItemDescription} numberOfLines={1}>Thông báo, ngôn ngữ, giao diện</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </View>
        </TouchableOpacity>

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
        <Text style={styles.version}>DirectorApp · EPCVINA · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ROSE_LIGHT },
  topHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: ROSE_LIGHT,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 40, height: 40 },
  logoTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  closeButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  pageHeader: { marginBottom: 4 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6b7280', fontStyle: 'italic' },

  // User card
  userCard: {
    backgroundColor: 'rgba(244, 63, 94, 0.06)', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  userAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#ffe4e6',
    justifyContent: 'center', alignItems: 'center',
  },
  userAvatarText: { fontSize: 24, fontWeight: 'bold', color: ROSE },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  userEmail: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#ffe4e6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    alignSelf: 'flex-start',
  },
  roleBadgeText: { fontSize: 10, fontWeight: '700', color: ROSE, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Menu
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 4 },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  menuGrid: { gap: 10 },
  menuItem: {
    backgroundColor: 'white', borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  menuItemContent: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuItemText: { flex: 1 },
  menuItemTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  menuItemDescription: { fontSize: 12, color: '#6b7280' },

  // Logout
  logoutButton: {
    backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8,
  },
  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },

  version: {
    fontSize: 10, color: '#9ca3af', textAlign: 'center', fontWeight: 'bold',
    textTransform: 'uppercase', letterSpacing: 1, opacity: 0.5, marginTop: 8, marginBottom: 20,
  },
})