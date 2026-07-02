/**
 * Unit tests for OAuth Configuration Manager
 */

import { OAuthConfigManager, OAuthConfigError, validateOAuthConfigOnStartup } from '../oauth-config'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {},
  },
}))

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}))

describe('OAuthConfigManager', () => {
  beforeEach(() => {
    // Reset the manager before each test
    OAuthConfigManager.reset()
    
    // Clear console warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getConfig', () => {
    it('should return Google configuration', () => {
      // Setup mock config
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_CLIENT_ID: 'test-google-client-id',
        GOOGLE_IOS_CLIENT_ID: 'test-ios-client-id',
        GOOGLE_ANDROID_CLIENT_ID: 'test-android-client-id',
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
      }

      const config = OAuthConfigManager.getConfig('google')

      expect(config).toEqual({
        clientId: 'test-google-client-id',
        iosClientId: 'test-ios-client-id',
        androidClientId: 'test-android-client-id',
        redirectUri: 'epcvina://oauth/google',
      })
    })

    it('should return Facebook configuration', () => {
      ;(Constants.expoConfig as any).extra = {
        FACEBOOK_APP_ID: 'test-facebook-app-id',
        FACEBOOK_REDIRECT_URI: 'epcvina://oauth/facebook',
      }

      const config = OAuthConfigManager.getConfig('facebook')

      expect(config).toEqual({
        appId: 'test-facebook-app-id',
        redirectUri: 'epcvina://oauth/facebook',
      })
    })

    it('should return Zalo configuration', () => {
      ;(Constants.expoConfig as any).extra = {
        ZALO_APP_ID: 'test-zalo-app-id',
        ZALO_APP_SECRET: 'test-zalo-secret',
        ZALO_REDIRECT_URI: 'epcvina://oauth/zalo',
      }

      const config = OAuthConfigManager.getConfig('zalo')

      expect(config).toEqual({
        appId: 'test-zalo-app-id',
        appSecret: 'test-zalo-secret',
        redirectUri: 'epcvina://oauth/zalo',
      })
    })

    it('should return empty strings for missing configuration', () => {
      ;(Constants.expoConfig as any).extra = {}

      const config = OAuthConfigManager.getConfig('google')

      expect(config).toEqual({
        clientId: '',
        iosClientId: '',
        androidClientId: '',
        redirectUri: '',
      })
    })
  })

  describe('getAllConfig', () => {
    it('should return complete OAuth configuration', () => {
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_CLIENT_ID: 'google-id',
        GOOGLE_IOS_CLIENT_ID: 'ios-id',
        GOOGLE_ANDROID_CLIENT_ID: 'android-id',
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
        FACEBOOK_APP_ID: 'facebook-id',
        FACEBOOK_REDIRECT_URI: 'epcvina://oauth/facebook',
        ZALO_APP_ID: 'zalo-id',
        ZALO_APP_SECRET: 'zalo-secret',
        ZALO_REDIRECT_URI: 'epcvina://oauth/zalo',
      }

      const config = OAuthConfigManager.getAllConfig()

      expect(config).toEqual({
        google: {
          clientId: 'google-id',
          iosClientId: 'ios-id',
          androidClientId: 'android-id',
          redirectUri: 'epcvina://oauth/google',
        },
        facebook: {
          appId: 'facebook-id',
          redirectUri: 'epcvina://oauth/facebook',
        },
        zalo: {
          appId: 'zalo-id',
          appSecret: 'zalo-secret',
          redirectUri: 'epcvina://oauth/zalo',
        },
      })
    })
  })

  describe('validateConfig', () => {
    it('should not throw error when all configuration is present', () => {
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_CLIENT_ID: 'google-id',
        GOOGLE_IOS_CLIENT_ID: 'ios-id',
        GOOGLE_ANDROID_CLIENT_ID: 'android-id',
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
        FACEBOOK_APP_ID: 'facebook-id',
        FACEBOOK_REDIRECT_URI: 'epcvina://oauth/facebook',
        ZALO_APP_ID: 'zalo-id',
        ZALO_APP_SECRET: 'zalo-secret',
        ZALO_REDIRECT_URI: 'epcvina://oauth/zalo',
      }

      expect(() => OAuthConfigManager.validateConfig()).not.toThrow()
    })

    it('should log warnings for missing Google configuration', () => {
      ;(Constants.expoConfig as any).extra = {}
      const warnSpy = jest.spyOn(console, 'warn')

      OAuthConfigManager.validateConfig()

      expect(warnSpy).toHaveBeenCalledWith('OAuth Configuration Warnings:')
      expect(warnSpy).toHaveBeenCalledWith('  - Google OAuth: Missing GOOGLE_CLIENT_ID')
      expect(warnSpy).toHaveBeenCalledWith('  - Google OAuth: Missing GOOGLE_IOS_CLIENT_ID for iOS')
      expect(warnSpy).toHaveBeenCalledWith('  - Google OAuth: Missing GOOGLE_REDIRECT_URI')
    })

    it('should log warnings for missing Facebook configuration', () => {
      ;(Constants.expoConfig as any).extra = {}
      const warnSpy = jest.spyOn(console, 'warn')

      OAuthConfigManager.validateConfig()

      expect(warnSpy).toHaveBeenCalledWith('  - Facebook OAuth: Missing FACEBOOK_APP_ID')
      expect(warnSpy).toHaveBeenCalledWith('  - Facebook OAuth: Missing FACEBOOK_REDIRECT_URI')
    })

    it('should log warnings for missing Zalo configuration', () => {
      ;(Constants.expoConfig as any).extra = {}
      const warnSpy = jest.spyOn(console, 'warn')

      OAuthConfigManager.validateConfig()

      expect(warnSpy).toHaveBeenCalledWith('  - Zalo OAuth: Missing ZALO_APP_ID')
      expect(warnSpy).toHaveBeenCalledWith('  - Zalo OAuth: Missing ZALO_APP_SECRET')
      expect(warnSpy).toHaveBeenCalledWith('  - Zalo OAuth: Missing ZALO_REDIRECT_URI')
    })

    it('should check platform-specific client IDs on iOS', () => {
      Platform.OS = 'ios'
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_CLIENT_ID: 'google-id',
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
      }
      const warnSpy = jest.spyOn(console, 'warn')

      OAuthConfigManager.validateConfig()

      expect(warnSpy).toHaveBeenCalledWith('  - Google OAuth: Missing GOOGLE_IOS_CLIENT_ID for iOS')
    })

    it('should check platform-specific client IDs on Android', () => {
      Platform.OS = 'android'
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_CLIENT_ID: 'google-id',
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
      }
      const warnSpy = jest.spyOn(console, 'warn')

      OAuthConfigManager.validateConfig()

      expect(warnSpy).toHaveBeenCalledWith('  - Google OAuth: Missing GOOGLE_ANDROID_CLIENT_ID for Android')
    })
  })

  describe('getRedirectUri', () => {
    it('should return redirect URI for Google', () => {
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
      }

      const uri = OAuthConfigManager.getRedirectUri('google')

      expect(uri).toBe('epcvina://oauth/google')
    })

    it('should return redirect URI for Facebook', () => {
      ;(Constants.expoConfig as any).extra = {
        FACEBOOK_REDIRECT_URI: 'epcvina://oauth/facebook',
      }

      const uri = OAuthConfigManager.getRedirectUri('facebook')

      expect(uri).toBe('epcvina://oauth/facebook')
    })

    it('should return redirect URI for Zalo', () => {
      ;(Constants.expoConfig as any).extra = {
        ZALO_REDIRECT_URI: 'epcvina://oauth/zalo',
      }

      const uri = OAuthConfigManager.getRedirectUri('zalo')

      expect(uri).toBe('epcvina://oauth/zalo')
    })
  })

  describe('isProviderConfigured', () => {
    beforeEach(() => {
      Platform.OS = 'ios'
    })

    it('should return true when Google is fully configured on iOS', () => {
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_CLIENT_ID: 'google-id',
        GOOGLE_IOS_CLIENT_ID: 'ios-id',
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
      }

      expect(OAuthConfigManager.isProviderConfigured('google')).toBe(true)
    })

    it('should return false when Google is missing iOS client ID', () => {
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_CLIENT_ID: 'google-id',
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
      }

      expect(OAuthConfigManager.isProviderConfigured('google')).toBe(false)
    })

    it('should return true when Google is fully configured on Android', () => {
      Platform.OS = 'android'
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_CLIENT_ID: 'google-id',
        GOOGLE_ANDROID_CLIENT_ID: 'android-id',
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
      }

      expect(OAuthConfigManager.isProviderConfigured('google')).toBe(true)
    })

    it('should return false when Google is missing Android client ID', () => {
      Platform.OS = 'android'
      ;(Constants.expoConfig as any).extra = {
        GOOGLE_CLIENT_ID: 'google-id',
        GOOGLE_REDIRECT_URI: 'epcvina://oauth/google',
      }

      expect(OAuthConfigManager.isProviderConfigured('google')).toBe(false)
    })

    it('should return true when Facebook is fully configured', () => {
      ;(Constants.expoConfig as any).extra = {
        FACEBOOK_APP_ID: 'facebook-id',
        FACEBOOK_REDIRECT_URI: 'epcvina://oauth/facebook',
      }

      expect(OAuthConfigManager.isProviderConfigured('facebook')).toBe(true)
    })

    it('should return false when Facebook is missing app ID', () => {
      ;(Constants.expoConfig as any).extra = {
        FACEBOOK_REDIRECT_URI: 'epcvina://oauth/facebook',
      }

      expect(OAuthConfigManager.isProviderConfigured('facebook')).toBe(false)
    })

    it('should return true when Zalo is fully configured', () => {
      ;(Constants.expoConfig as any).extra = {
        ZALO_APP_ID: 'zalo-id',
        ZALO_APP_SECRET: 'zalo-secret',
        ZALO_REDIRECT_URI: 'epcvina://oauth/zalo',
      }

      expect(OAuthConfigManager.isProviderConfigured('zalo')).toBe(true)
    })

    it('should return false when Zalo is missing app secret', () => {
      ;(Constants.expoConfig as any).extra = {
        ZALO_APP_ID: 'zalo-id',
        ZALO_REDIRECT_URI: 'epcvina://oauth/zalo',
      }

      expect(OAuthConfigManager.isProviderConfigured('zalo')).toBe(false)
    })

    it('should return false for unconfigured providers', () => {
      ;(Constants.expoConfig as any).extra = {}

      expect(OAuthConfigManager.isProviderConfigured('google')).toBe(false)
      expect(OAuthConfigManager.isProviderConfigured('facebook')).toBe(false)
      expect(OAuthConfigManager.isProviderConfigured('zalo')).toBe(false)
    })
  })

  describe('validateOAuthConfigOnStartup', () => {
    it('should call validateConfig without throwing', () => {
      ;(Constants.expoConfig as any).extra = {}

      expect(() => validateOAuthConfigOnStartup()).not.toThrow()
    })

    it('should not throw error even if validation encounters issues', () => {
      ;(Constants.expoConfig as any).extra = {}

      // Should not throw even with missing config
      expect(() => validateOAuthConfigOnStartup()).not.toThrow()
    })
  })

  describe('OAuthConfigError', () => {
    it('should create error with correct name', () => {
      const error = new OAuthConfigError('Test error')

      expect(error.name).toBe('OAuthConfigError')
      expect(error.message).toBe('Test error')
      expect(error).toBeInstanceOf(Error)
    })
  })
})
