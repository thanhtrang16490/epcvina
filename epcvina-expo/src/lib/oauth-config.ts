/**
 * OAuth Configuration Manager
 * 
 * Quản lý cấu hình OAuth cho các providers: Google, Facebook, Zalo
 * Đọc credentials từ environment variables và validate configuration
 */

import { Platform } from 'react-native'
import Constants from 'expo-constants'

/**
 * OAuth Provider types
 */
export type OAuthProvider = 'google' | 'facebook' | 'zalo'

/**
 * Google OAuth Configuration
 */
export interface GoogleOAuthConfig {
  clientId: string
  iosClientId?: string
  androidClientId?: string
  redirectUri: string
}

/**
 * Facebook OAuth Configuration
 */
export interface FacebookOAuthConfig {
  appId: string
  redirectUri: string
}

/**
 * Zalo OAuth Configuration
 */
export interface ZaloOAuthConfig {
  appId: string
  appSecret: string
  redirectUri: string
}

/**
 * Complete OAuth Configuration
 */
export interface OAuthConfig {
  google: GoogleOAuthConfig
  facebook: FacebookOAuthConfig
  zalo: ZaloOAuthConfig
}

/**
 * Provider-specific configuration union type
 */
export type ProviderConfig = GoogleOAuthConfig | FacebookOAuthConfig | ZaloOAuthConfig

/**
 * Configuration validation error
 */
export class OAuthConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OAuthConfigError'
  }
}

/**
 * OAuth Configuration Manager
 * 
 * Singleton class để quản lý OAuth configuration
 */
class OAuthConfigManagerClass {
  private config: OAuthConfig | null = null
  private initialized = false

  /**
   * Khởi tạo configuration từ environment variables
   */
  private initialize(): void {
    if (this.initialized) return

    const env = Constants.expoConfig?.extra || {}

    this.config = {
      google: {
        clientId: env.GOOGLE_CLIENT_ID || '',
        iosClientId: env.GOOGLE_IOS_CLIENT_ID || '',
        androidClientId: env.GOOGLE_ANDROID_CLIENT_ID || '',
        redirectUri: env.GOOGLE_REDIRECT_URI || '',
      },
      facebook: {
        appId: env.FACEBOOK_APP_ID || '',
        redirectUri: env.FACEBOOK_REDIRECT_URI || '',
      },
      zalo: {
        appId: env.ZALO_APP_ID || '',
        appSecret: env.ZALO_APP_SECRET || '',
        redirectUri: env.ZALO_REDIRECT_URI || '',
      },
    }

    this.initialized = true
  }

  /**
   * Lấy cấu hình cho một provider cụ thể
   * 
   * @param provider - Tên provider (google, facebook, zalo)
   * @returns Provider configuration
   */
  getConfig(provider: OAuthProvider): ProviderConfig {
    this.initialize()

    if (!this.config) {
      throw new OAuthConfigError('OAuth configuration not initialized')
    }

    return this.config[provider]
  }

  /**
   * Lấy toàn bộ OAuth configuration
   * 
   * @returns Complete OAuth configuration
   */
  getAllConfig(): OAuthConfig {
    this.initialize()

    if (!this.config) {
      throw new OAuthConfigError('OAuth configuration not initialized')
    }

    return this.config
  }

  /**
   * Validate tất cả required configuration
   * 
   * Kiểm tra xem các OAuth credentials cần thiết đã được cấu hình chưa.
   * Log warnings cho các providers thiếu config nhưng không throw error
   * để app vẫn có thể chạy với các providers khác.
   * 
   * @throws OAuthConfigError nếu có lỗi nghiêm trọng trong configuration
   */
  validateConfig(): void {
    this.initialize()

    if (!this.config) {
      throw new OAuthConfigError('OAuth configuration not initialized')
    }

    const warnings: string[] = []

    // Validate Google configuration
    if (!this.config.google.clientId) {
      warnings.push('Google OAuth: Missing GOOGLE_CLIENT_ID')
    }
    if (Platform.OS === 'ios' && !this.config.google.iosClientId) {
      warnings.push('Google OAuth: Missing GOOGLE_IOS_CLIENT_ID for iOS')
    }
    if (Platform.OS === 'android' && !this.config.google.androidClientId) {
      warnings.push('Google OAuth: Missing GOOGLE_ANDROID_CLIENT_ID for Android')
    }
    if (!this.config.google.redirectUri) {
      warnings.push('Google OAuth: Missing GOOGLE_REDIRECT_URI')
    }

    // Validate Facebook configuration
    if (!this.config.facebook.appId) {
      warnings.push('Facebook OAuth: Missing FACEBOOK_APP_ID')
    }
    if (!this.config.facebook.redirectUri) {
      warnings.push('Facebook OAuth: Missing FACEBOOK_REDIRECT_URI')
    }

    // Validate Zalo configuration
    if (!this.config.zalo.appId) {
      warnings.push('Zalo OAuth: Missing ZALO_APP_ID')
    }
    if (!this.config.zalo.appSecret) {
      warnings.push('Zalo OAuth: Missing ZALO_APP_SECRET')
    }
    if (!this.config.zalo.redirectUri) {
      warnings.push('Zalo OAuth: Missing ZALO_REDIRECT_URI')
    }

    // Log warnings
    if (warnings.length > 0) {
      console.warn('OAuth Configuration Warnings:')
      warnings.forEach(warning => console.warn(`  - ${warning}`))
      console.warn('Social login buttons for providers with missing config will be disabled.')
    }
  }

  /**
   * Lấy redirect URI cho platform hiện tại
   * 
   * @param provider - Tên provider (google, facebook, zalo)
   * @returns Redirect URI cho platform hiện tại
   */
  getRedirectUri(provider: OAuthProvider): string {
    this.initialize()

    if (!this.config) {
      throw new OAuthConfigError('OAuth configuration not initialized')
    }

    const providerConfig = this.config[provider]
    return providerConfig.redirectUri
  }

  /**
   * Kiểm tra xem provider có được cấu hình đúng không
   * 
   * @param provider - Tên provider (google, facebook, zalo)
   * @returns true nếu provider được cấu hình đầy đủ
   */
  isProviderConfigured(provider: OAuthProvider): boolean {
    this.initialize()

    if (!this.config) {
      return false
    }

    const providerConfig = this.config[provider]

    switch (provider) {
      case 'google':
        const googleConfig = providerConfig as GoogleOAuthConfig
        const hasClientId = !!googleConfig.clientId
        const hasPlatformClientId = Platform.OS === 'ios' 
          ? !!googleConfig.iosClientId 
          : !!googleConfig.androidClientId
        return hasClientId && hasPlatformClientId && !!googleConfig.redirectUri

      case 'facebook':
        const facebookConfig = providerConfig as FacebookOAuthConfig
        return !!facebookConfig.appId && !!facebookConfig.redirectUri

      case 'zalo':
        const zaloConfig = providerConfig as ZaloOAuthConfig
        return !!zaloConfig.appId && !!zaloConfig.appSecret && !!zaloConfig.redirectUri

      default:
        return false
    }
  }

  /**
   * Reset configuration (chủ yếu dùng cho testing)
   */
  reset(): void {
    this.config = null
    this.initialized = false
  }
}

/**
 * Singleton instance của OAuthConfigManager
 */
export const OAuthConfigManager = new OAuthConfigManagerClass()

/**
 * Validate OAuth configuration khi app khởi động
 * 
 * Gọi hàm này trong app initialization để validate config sớm
 */
export function validateOAuthConfigOnStartup(): void {
  try {
    OAuthConfigManager.validateConfig()
  } catch (error) {
    console.error('Failed to validate OAuth configuration:', error)
  }
}
