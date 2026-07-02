/**
 * Constants Index
 * Central export for all constants
 */

export * from './colors'
export * from './layout'

/**
 * API Configuration
 */
export const API = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

/**
 * Cache Configuration
 */
export const CACHE = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 2 * 60 * 1000, // 2 minutes
} as const

/**
 * Validation Rules
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
  PASSWORD_MIN_LENGTH: 8,
} as const

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  TIME: 'HH:mm',
} as const

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  CACHED_DATA: 'cached_data',
  ERROR_LOGS: 'error_logs',
  REMEMBERED_EMAIL: 'remembered_email',
} as const
