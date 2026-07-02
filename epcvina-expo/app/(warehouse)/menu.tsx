import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import AppHeader from '../../src/components/AppHeader'

export default function WarehouseMenuScreen() {
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut()
            router.replace('/(auth)/login')
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader showNotification={false} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* User Info */}
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={32} color="#f59e0b" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.full_name || 'Nhân viên kho'}</Text>
              <Text style={styles.userRole}>Quản lý kho</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Quản lý</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(warehouse)/dashboard')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="grid" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.menuItemText}>Tổng quan</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(warehouse)/stock-in')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="download" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.menuItemText}>Nhập kho</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(warehouse)/orders')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="cube" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.menuItemText}>Đơn chờ xuất</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(warehouse)/products')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#d1fae5' }]}>
                  <Ionicons name="pricetags" size={20} color="#10b981" />
                </View>
                <Text style={styles.menuItemText}>Sản phẩm</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(warehouse)/reports')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#e0e7ff' }]}>
                  <Ionicons name="bar-chart" size={20} color="#6366f1" />
                </View>
                <Text style={styles.menuItemText}>Báo cáo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(warehouse)/history')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="time" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.menuItemText}>Lịch sử kho</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(warehouse)/production')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="construct" size={20} color="#f59e0b" />
                </View>
                <Text style={styles.menuItemText}>Sản xuất</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Tài khoản</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/account')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#dbeafe' }]}>
                  <Ionicons name="person" size={20} color="#2563eb" />
                </View>
                <Text style={styles.menuItemText}>Thông tin cá nhân</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fee2e2' }]}>
                  <Ionicons name="log-out" size={20} color="#dc2626" />
                </View>
                <Text style={[styles.menuItemText, { color: '#dc2626' }]}>Đăng xuất</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userAvatar: {
    width: 64,
    height: 64,
    backgroundColor: '#fef3c7',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
})
