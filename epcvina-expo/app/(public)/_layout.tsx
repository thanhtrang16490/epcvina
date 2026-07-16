import { Stack, router } from 'expo-router'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
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
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  brandName: {
    color: '#175ead',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 1,
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderColor: '#175ead',
    borderRadius: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  loginText: {
    color: '#175ead',
    fontSize: 14,
    fontWeight: '600',
  },
  logo: {
    height: 28,
    width: 28,
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderColor: '#bfdbfe',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  safeArea: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
})
