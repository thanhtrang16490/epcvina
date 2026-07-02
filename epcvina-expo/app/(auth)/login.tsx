import { useState, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ScrollView, Image, StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../src/contexts/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AUTH_CONFIG, APP_CONFIG } from '../../src/constants/config'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [hasRememberedEmail, setHasRememberedEmail] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    loadRememberedEmail()
  }, [])

  const [showPassword, setShowPassword] = useState(false)

  const loadRememberedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem(AUTH_CONFIG.rememberedEmailKey)
      if (savedEmail) {
        setEmail(savedEmail)
        setHasRememberedEmail(true)
      }
    } catch {
      // Non-critical — silently ignore
    }
  }

  const clearRememberedEmail = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_CONFIG.rememberedEmailKey)
      setEmail('')
      setHasRememberedEmail(false)
    } catch {
      // Non-critical — silently ignore
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu')
      return
    }

    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)

    if (result.error) {
      Alert.alert('Lỗi đăng nhập', result.error)
      return
    }

    // Save or remove email based on rememberMe preference
    try {
      if (rememberMe) {
        await AsyncStorage.setItem(AUTH_CONFIG.rememberedEmailKey, email)
      } else {
        await AsyncStorage.removeItem(AUTH_CONFIG.rememberedEmailKey)
      }
    } catch {
      // Non-critical — silently ignore
    }

    // Redirect based on role
    if (result.role === 'customer') {
      router.replace('/(customer)/dashboard')
    } else if (['sale', 'admin', 'sale_admin'].includes(result.role || '')) {
      router.replace('/(sales)/dashboard')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>{APP_CONFIG.name}</Text>
              <Text style={styles.subtitle}>Đăng nhập vào hệ thống</Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWithButton}>
                  <TextInput
                    style={[styles.input, hasRememberedEmail && styles.inputWithClear]}
                    placeholder="email@example.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                  />
                  {hasRememberedEmail && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={clearRememberedEmail}
                    >
                      <Ionicons name="close-circle" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                  )}
                </View>
                {hasRememberedEmail && (
                  <Text style={styles.rememberedText}>
                    <Ionicons name="checkmark-circle" size={14} color="#10b981" /> Tài khoản đã lưu
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={styles.inputWithButton}>
                  <TextInput
                    style={[styles.input, styles.inputWithClear]}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setShowPassword(prev => !prev)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={loading}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text style={styles.rememberMeText}>Ghi nhớ tài khoản</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>Đăng nhập</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                <Text style={styles.linkText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            {/* Browse without login */}
            <View style={styles.guestContainer}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>hoặc</Text>
                <View style={styles.dividerLine} />
              </View>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => router.replace('/(public)/products' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="eye-outline" size={18} color="#6b7280" />
                <Text style={styles.guestButtonText}>Xem sản phẩm không cần đăng nhập</Text>
              </TouchableOpacity>
            </View>

            {/* Info Text */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Dành cho khách hàng và nhân viên
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#175ead',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputWithButton: {
    position: 'relative',
  },
  inputWithClear: {
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  rememberedText: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 4,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#374151',
  },
  button: {
    backgroundColor: '#175ead',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: '#175ead',
    textAlign: 'center',
    fontSize: 14,
  },
  infoContainer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  infoText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 13,
  },
  guestContainer: {
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 13,
    color: '#9ca3af',
    marginHorizontal: 10,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  guestButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
})
