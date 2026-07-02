/**
 * Social Authentication Service
 * 
 * Service chịu trách nhiệm xử lý OAuth flows cho tất cả các providers (Google, Facebook, Zalo).
 * Tích hợp với Supabase Auth để tạo/cập nhật user records và quản lý sessions.
 * 
 * Requirements: 1.1, 2.1, 3.1
 */

import { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { OAuthConfigManager } from './oauth-config'

/**
 * OAuth Provider types
 */
export type OAuthProvider = 'google' | 'facebook' | 'zalo'

/**
 * Authentication error structure
 */
export interface AuthError {
  code: string
  message: string
  details?: unknown
  retryable?: boolean
}

/**
 * Result returned from authentication operations
 */
export interface AuthResult {
  session?: Session
  user?: User
  error?: AuthError
  requiresAccountLinking?: boolean
}

/**
 * Social Authentication Service Interface
 * 
 * Defines the contract for OAuth authentication operations across all providers.
 */
export interface SocialAuthService {
  /**
   * Khởi tạo Google OAuth flow
   * 
   * Sử dụng native Google Sign-In SDK để authenticate user.
   * Exchange Google ID token với Supabase Auth để tạo session.
   * 
   * @returns Promise với session hoặc error
   * @throws AuthError nếu OAuth flow thất bại
   */
  signInWithGoogle(): Promise<AuthResult>
  
  /**
   * Khởi tạo Facebook OAuth flow
   * 
   * Sử dụng Facebook SDK để authenticate user với permissions: public_profile, email.
   * Exchange Facebook access token với Supabase Auth để tạo session.
   * 
   * @returns Promise với session hoặc error
   * @throws AuthError nếu OAuth flow thất bại
   */
  signInWithFacebook(): Promise<AuthResult>
  
  /**
   * Khởi tạo Zalo OAuth flow
   * 
   * Sử dụng custom OAuth flow (web-based) vì Zalo không có official React Native SDK.
   * Mở Zalo OAuth consent screen trong browser, nhận authorization code,
   * exchange cho access token, và tạo/cập nhật user trong Supabase.
   * 
   * @returns Promise với session hoặc error
   * @throws AuthError nếu OAuth flow thất bại
   */
  signInWithZalo(): Promise<AuthResult>
  
  /**
   * Xử lý OAuth callback từ provider
   * 
   * Parse deep link URL để lấy authorization code hoặc access token,
   * validate state parameter (CSRF protection), và complete OAuth flow.
   * 
   * @param url - Deep link URL chứa authorization code hoặc access token
   * @returns Promise hoàn tất khi callback được xử lý
   * @throws AuthError nếu callback không hợp lệ hoặc xử lý thất bại
   */
  handleOAuthCallback(url: string): Promise<void>
  
  /**
   * Kiểm tra xem provider có được cấu hình đúng không
   * 
   * Validate rằng tất cả required OAuth configuration (client IDs, secrets, redirect URIs)
   * đã được set trong environment variables.
   * 
   * @param provider - Tên provider (google, facebook, zalo)
   * @returns true nếu provider được cấu hình đầy đủ, false nếu thiếu config
   */
  isProviderConfigured(provider: OAuthProvider): boolean
}

/**
 * Default implementation of Social Authentication Service
 * 
 * Skeleton implementation - methods will be implemented in subsequent tasks.
 */
export class DefaultSocialAuthService implements SocialAuthService {
  /**
   * Khởi tạo Google OAuth flow
   * 
   * TODO: Implement in Task 3.2
   * - Configure Google Sign-In SDK
   * - Trigger native OAuth flow
   * - Exchange ID token with Supabase
   * - Handle errors and cancellation
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      if (!this.isProviderConfigured('google')) {
        return {
          error: {
            code: 'PROVIDER_NOT_CONFIGURED',
            message: 'Google OAuth chưa được cấu hình đầy đủ',
            retryable: false,
          },
        }
      }

      const redirectTo = OAuthConfigManager.getRedirectUri('google')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      })

      if (error) {
        return {
          error: {
            code: error.name || 'GOOGLE_SIGN_IN_FAILED',
            message: error.message,
            details: error,
            retryable: true,
          },
        }
      }

      if (!data?.url) {
        return {
          error: {
            code: 'GOOGLE_OAUTH_URL_MISSING',
            message: 'Không thể khởi tạo Google OAuth URL',
            retryable: true,
          },
        }
      }

      return {}
    } catch (err) {
      return {
        error: {
          code: 'GOOGLE_SIGN_IN_EXCEPTION',
          message: err instanceof Error ? err.message : 'Google sign-in failed',
          details: err,
          retryable: true,
        },
      }
    }
  }
  
  /**
   * Khởi tạo Facebook OAuth flow
   * 
   * TODO: Implement in Task 3.4
   * - Configure Facebook SDK
   * - Request permissions: public_profile, email
   * - Exchange access token with Supabase
   * - Handle missing email case
   */
  async signInWithFacebook(): Promise<AuthResult> {
    try {
      if (!this.isProviderConfigured('facebook')) {
        return {
          error: {
            code: 'PROVIDER_NOT_CONFIGURED',
            message: 'Facebook OAuth chưa được cấu hình đầy đủ',
            retryable: false,
          },
        }
      }

      const redirectTo = OAuthConfigManager.getRedirectUri('facebook')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      })

      if (error) {
        return {
          error: {
            code: error.name || 'FACEBOOK_SIGN_IN_FAILED',
            message: error.message,
            details: error,
            retryable: true,
          },
        }
      }

      if (!data?.url) {
        return {
          error: {
            code: 'FACEBOOK_OAUTH_URL_MISSING',
            message: 'Không thể khởi tạo Facebook OAuth URL',
            retryable: true,
          },
        }
      }

      return {}
    } catch (err) {
      return {
        error: {
          code: 'FACEBOOK_SIGN_IN_EXCEPTION',
          message: err instanceof Error ? err.message : 'Facebook sign-in failed',
          details: err,
          retryable: true,
        },
      }
    }
  }
  
  /**
   * Khởi tạo Zalo OAuth flow
   * 
   * TODO: Implement in Task 3.6
   * - Build Zalo OAuth URL with PKCE
   * - Open web browser for consent
   * - Handle callback with authorization code
   * - Exchange code for access token
   * - Fetch user profile from Zalo API
   * - Create/update user in Supabase
   */
  async signInWithZalo(): Promise<AuthResult> {
    return {
      error: {
        code: 'ZALO_NOT_SUPPORTED',
        message: 'Đăng nhập Zalo tạm thời chưa được hỗ trợ',
        retryable: false,
      },
    }
  }
  
  /**
   * Xử lý OAuth callback từ provider
   * 
   * TODO: Implement callback handling
   * - Parse URL parameters (code, state, error)
   * - Validate state parameter
   * - Complete OAuth flow based on provider
   */
  async handleOAuthCallback(url: string): Promise<void> {
    try {
      const parsedUrl = new URL(url)
      const error = parsedUrl.searchParams.get('error') || parsedUrl.searchParams.get('error_description')
      if (error) {
        throw new Error(`OAuth callback error: ${error}`)
      }
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'OAuth callback handling failed'
      )
    }
  }
  
  /**
   * Kiểm tra xem provider có được cấu hình đúng không
   * 
   * TODO: Implement configuration validation
   * - Check environment variables for required config
   * - Validate client IDs, secrets, redirect URIs
   * - Return false if any required config is missing
   */
  isProviderConfigured(provider: OAuthProvider): boolean {
    if (provider === 'zalo') return false
    return OAuthConfigManager.isProviderConfigured(provider)
  }
}

/**
 * Singleton instance of Social Auth Service
 * 
 * Export a single instance to be used throughout the application.
 */
export const socialAuthService = new DefaultSocialAuthService()
