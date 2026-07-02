import { Stack, router } from 'expo-router'
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

/**
 * Public Layout — dành cho khách chưa đăng nhập.
 * Hiển thị header đơn giản với logo và nút "Đăng nhập".
 * Không yêu cầu xác thực — mọi người đều có thể xem sản phẩm.
 */
export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <PublicHeader />,
        headerShown: true,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#f9fafb' },
      }}
    >
      <Stack.Screen name="products" options={{ title: 'Sản phẩm' }} />
      <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
    </Stack>
  )
}

function PublicHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo / Brand */}
        <View style={styles.brand}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.brandTextContainer}>
            <Text style={styles.brandName}>EPCVINA</Text>
            <Text style={styles.brandSubtitle}>Điện mặt trời EPCVINA</Text>
          </View>
        </View>

        {/* Login CTA */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={16} color="#175ead" />
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  logo: {
    width: 28,
    height: 28,
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#175ead',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 1,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#175ead',
    backgroundColor: '#eff6ff',
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#175ead',
  },
})
