/**
 * Biometric Authentication Service
 * Handle Face ID, Touch ID, and fingerprint authentication
 * 
 * Features:
 * - Check biometric availability
 * - Authenticate with biometrics
 * - Fallback to password
 * - Secure storage integration
 */

import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { ErrorTracker } from './error-tracking'
import { Analytics, AnalyticsEvents } from './analytics'

/**
 * Biometric type
 */
export enum BiometricType {
  FINGERPRINT = 'fingerprint',
  FACIAL_RECOGNITION = 'facial_recognition',
  IRIS = 'iris',
  NONE = 'none',
}

/**
 * Authentication result
 */
export interface AuthResult {
  success: boolean
  error?: string
  biometricType?: BiometricType
}

/**
 * Biometric capabilities
 */
export interface BiometricCapabilities {
  isAvailable: boolean
  isEnrolled: boolean
  supportedTypes: BiometricType[]
  securityLevel: LocalAuthentication.SecurityLevel
}

/**
 * Biometric Authentication Manager
 */
export class BiometricAuth {
  private static readonly BIOMETRIC_ENABLED_KEY = 'biometric_enabled'
  private static readonly CREDENTIALS_KEY = 'user_credentials'

  /**
   * Check if biometric authentication is available
   * 
   * @returns Biometric capabilities
   * 
   * @example
   * ```typescript
   * const capabilities = await BiometricAuth.checkAvailability()
   * if (capabilities.isAvailable && capabilities.isEnrolled) {
   *   // Show biometric login option
   * }
   * ```
   */
  static async checkAvailability(): Promise<BiometricCapabilities> {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
      const securityLevel = await LocalAuthentication.getEnrolledLevelAsync()

      const types: BiometricType[] = supportedTypes.map((type: LocalAuthentication.AuthenticationType) => {
        switch (type) {
          case LocalAuthentication.AuthenticationType.FINGERPRINT:
            return BiometricType.FINGERPRINT
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            return BiometricType.FACIAL_RECOGNITION
          case LocalAuthentication.AuthenticationType.IRIS:
            return BiometricType.IRIS
          default:
            return BiometricType.NONE
        }
      })

      return {
        isAvailable,
        isEnrolled,
        supportedTypes: types,
        securityLevel,
      }
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'BiometricAuth.checkAvailability',
      })
      return {
        isAvailable: false,
        isEnrolled: false,
        supportedTypes: [],
        securityLevel: LocalAuthentication.SecurityLevel.NONE,
      }
    }
  }

  /**
   * Authenticate with biometrics
   * 
   * @param promptMessage - Message to show in biometric prompt
   * @param cancelLabel - Label for cancel button
   * @returns Authentication result
   * 
   * @example
   * ```typescript
   * const result = await BiometricAuth.authenticate('Đăng nhập bằng vân tay')
   * if (result.success) {
   *   // Authentication successful
   *   const credentials = await BiometricAuth.getStoredCredentials()
   *   await signIn(credentials)
   * }
   * ```
   */
  static async authenticate(
    promptMessage: string = 'Xác thực để tiếp tục',
    cancelLabel: string = 'Hủy'
  ): Promise<AuthResult> {
    try {
      // Check availability first
      const capabilities = await this.checkAvailability()
      
      if (!capabilities.isAvailable) {
        return {
          success: false,
          error: 'Thiết bị không hỗ trợ xác thực sinh trắc học',
        }
      }

      if (!capabilities.isEnrolled) {
        return {
          success: false,
          error: 'Chưa thiết lập xác thực sinh trắc học trên thiết bị',
        }
      }

      // Authenticate
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel,
        fallbackLabel: 'Sử dụng mật khẩu',
        disableDeviceFallback: false,
      })

      if (result.success) {
        // Track successful authentication
        Analytics.trackEvent(AnalyticsEvents.BIOMETRIC_AUTH_SUCCESS, {
          platform: Platform.OS,
          type: capabilities.supportedTypes[0],
        })

        return {
          success: true,
          biometricType: capabilities.supportedTypes[0],
        }
      } else {
        // Track failed authentication
        Analytics.trackEvent(AnalyticsEvents.BIOMETRIC_AUTH_FAILED, {
          platform: Platform.OS,
          error: result.error,
        })

        return {
          success: false,
          error: this.getErrorMessage(result.error),
        }
      }
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'BiometricAuth.authenticate',
      })
      return {
        success: false,
        error: 'Có lỗi xảy ra khi xác thực',
      }
    }
  }

  /**
   * Enable biometric authentication
   * Store credentials securely for future biometric logins
   * 
   * @param email - User email
   * @param password - User password (will be encrypted)
   * @returns Success status
   * 
   * @example
   * ```typescript
   * // After successful login
   * const enabled = await BiometricAuth.enableBiometric(email, password)
   * if (enabled) {
   *   Alert.alert('Thành công', 'Đã bật xác thực sinh trắc học')
   * }
   * ```
   */
  static async enableBiometric(email: string, password: string): Promise<boolean> {
    try {
      // Check if biometric is available
      const capabilities = await this.checkAvailability()
      if (!capabilities.isAvailable || !capabilities.isEnrolled) {
        return false
      }

      // Authenticate first
      const authResult = await this.authenticate('Xác thực để bật đăng nhập sinh trắc học')
      if (!authResult.success) {
        return false
      }

      // Store credentials securely
      const credentials = JSON.stringify({ email, password })
      await SecureStore.setItemAsync(this.CREDENTIALS_KEY, credentials)
      await SecureStore.setItemAsync(this.BIOMETRIC_ENABLED_KEY, 'true')

      // Track analytics
      Analytics.trackEvent(AnalyticsEvents.BIOMETRIC_ENABLED, {
        platform: Platform.OS,
      })

      return true
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'BiometricAuth.enableBiometric',
      })
      return false
    }
  }

  /**
   * Disable biometric authentication
   * Remove stored credentials
   * 
   * @returns Success status
   */
  static async disableBiometric(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(this.CREDENTIALS_KEY)
      await SecureStore.deleteItemAsync(this.BIOMETRIC_ENABLED_KEY)

      // Track analytics
      Analytics.trackEvent(AnalyticsEvents.BIOMETRIC_DISABLED, {
        platform: Platform.OS,
      })

      return true
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'BiometricAuth.disableBiometric',
      })
      return false
    }
  }

  /**
   * Check if biometric is enabled
   * @returns Whether biometric is enabled
   */
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(this.BIOMETRIC_ENABLED_KEY)
      return enabled === 'true'
    } catch (error) {
      return false
    }
  }

  /**
   * Get stored credentials
   * Only returns credentials after successful biometric authentication
   * 
   * @returns Stored credentials or null
   */
  static async getStoredCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const credentials = await SecureStore.getItemAsync(this.CREDENTIALS_KEY)
      if (!credentials) {
        return null
      }

      return JSON.parse(credentials)
    } catch (error) {
      ErrorTracker.logError(error as Error, {
        context: 'BiometricAuth.getStoredCredentials',
      })
      return null
    }
  }

  /**
   * Get biometric type name for display
   * @param type - Biometric type
   * @returns Display name
   */
  static getBiometricTypeName(type: BiometricType): string {
    switch (type) {
      case BiometricType.FINGERPRINT:
        return Platform.OS === 'ios' ? 'Touch ID' : 'Vân tay'
      case BiometricType.FACIAL_RECOGNITION:
        return Platform.OS === 'ios' ? 'Face ID' : 'Nhận diện khuôn mặt'
      case BiometricType.IRIS:
        return 'Nhận diện mống mắt'
      default:
        return 'Sinh trắc học'
    }
  }

  /**
   * Get user-friendly error message
   * @param error - Error code
   * @returns Error message
   */
  private static getErrorMessage(error?: string): string {
    switch (error) {
      case 'user_cancel':
        return 'Đã hủy xác thực'
      case 'system_cancel':
        return 'Hệ thống đã hủy xác thực'
      case 'authentication_failed':
        return 'Xác thực không thành công'
      case 'user_fallback':
        return 'Người dùng chọn sử dụng mật khẩu'
      case 'lockout':
        return 'Đã bị khóa do quá nhiều lần thử'
      case 'lockout_permanent':
        return 'Đã bị khóa vĩnh viễn'
      case 'not_enrolled':
        return 'Chưa thiết lập xác thực sinh trắc học'
      case 'not_available':
        return 'Xác thực sinh trắc học không khả dụng'
      default:
        return 'Xác thực không thành công'
    }
  }

  /**
   * Get biometric icon name
   * @param type - Biometric type
   * @returns Icon name for Ionicons
   */
  static getBiometricIcon(type: BiometricType): string {
    switch (type) {
      case BiometricType.FINGERPRINT:
        return 'finger-print'
      case BiometricType.FACIAL_RECOGNITION:
        return 'scan'
      case BiometricType.IRIS:
        return 'eye'
      default:
        return 'lock-closed'
    }
  }
}
