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
                onPress={() => router.replace('/(public)/calculator' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="calculator-outline" size={18} color="#6b7280" />
                <Text style={styles.guestButtonText}>Tính điện mặt trời không cần đăng nhập</Text>
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
  button: {
    alignItems: 'center',
    backgroundColor: '#175ead',
    borderRadius: 8,
    paddingVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginRight: 8,
    width: 20,
  },
  checkboxChecked: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dividerLine: {
    backgroundColor: '#e5e7eb',
    flex: 1,
    height: 1,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  dividerText: {
    color: '#9ca3af',
    fontSize: 13,
    marginHorizontal: 10,
  },
  form: {
    gap: 16,
  },
  guestButton: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 13,
  },
  guestButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  guestContainer: {
    marginTop: 8,
  },
  infoContainer: {
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    marginTop: 32,
    paddingTop: 24,
  },
  infoText: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
  },
  input: {
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWithButton: {
    position: 'relative',
  },
  inputWithClear: {
    paddingRight: 40,
  },
  keyboardView: {
    flex: 1,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: '#175ead',
    fontSize: 14,
    textAlign: 'center',
  },
  logo: {
    height: 96,
    marginBottom: 16,
    width: 96,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  rememberMeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  rememberMeText: {
    color: '#374151',
    fontSize: 14,
  },
  rememberedText: {
    color: '#10b981',
    fontSize: 12,
    marginTop: 4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    color: '#175ead',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
})
