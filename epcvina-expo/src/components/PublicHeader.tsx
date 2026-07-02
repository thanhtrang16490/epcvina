import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

interface PublicHeaderProps {
  title?: string
  showBackButton?: boolean
  showLoginButton?: boolean
}

export default function PublicHeader({ 
  title = 'EPCVINA', 
  showBackButton = false,
  showLoginButton = true 
}: PublicHeaderProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        {/* Left Side */}
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#175ead" />
            </TouchableOpacity>
          ) : (
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/icon.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        {/* Center */}
        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Giải pháp điện mặt trời chất lượng cao</Text>
        </View>

        {/* Right Side */}
        <View style={styles.rightSection}>
          {showLoginButton && (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/(auth)/login')}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={18} color="#175ead" />
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
  },
  leftSection: {
    width: 80,
    alignItems: 'flex-start',
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#175ead',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
    textAlign: 'center',
  },
  rightSection: {
    width: 80,
    alignItems: 'flex-end',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  loginText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#175ead',
  },
})