/**
 * App Configuration
 * Centralized configuration values for the application.
 * Use environment variables for sensitive/environment-specific values.
 */

// ─── Contact ──────────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  /** App display name */
  name: 'EPCVINA',

  /** Support hotline - override via EXPO_PUBLIC_HOTLINE env var */
  hotline: process.env.EXPO_PUBLIC_HOTLINE ?? '0123456789',

  /** Support email */
  supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? 'support@epcvina.com',

  /** App version */
  version: '1.0.0',
} as const

// ─── API ─────────────────────────────────────────────────────────────────────

export const API_CONFIG = {
  /** Base URL for Go backend */
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api',

  /** Request timeout in milliseconds */
  timeout: 30_000,

  /** Number of retry attempts for failed requests */
  maxRetries: 3,
} as const

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const AUTH_CONFIG = {
  /** Maximum wait time for auth initialization (ms) */
  initTimeoutMs: 5_000,

  /** AsyncStorage key for remembered email */
  rememberedEmailKey: '@epcvina:remembered_email',
} as const

// ─── Cache ────────────────────────────────────────────────────────────────────

export const CACHE_CONFIG = {
  /** Default cache TTL in milliseconds (5 minutes) */
  defaultTtlMs: 5 * 60 * 1_000,

  /** Cache key prefix */
  prefix: '@epcvina_cache:',
} as const

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PAGINATION_CONFIG = {
  /** Default page size for lists */
  defaultPageSize: 20,

  /** Maximum items shown in quick search results */
  quickSearchLimit: 5,

  /** Maximum customers shown in search dropdown */
  customerSearchLimit: 10,

  /** Number of recent orders shown on dashboard */
  recentOrdersLimit: 5,
} as const

// ─── UI ───────────────────────────────────────────────────────────────────────

export const UI_CONFIG = {
  /** Debounce delay for search inputs (ms) */
  searchDebounceMs: 300,

  /** Minimum characters before triggering search */
  searchMinChars: 2,

  /** Toast notification duration (ms) */
  toastDurationMs: 2_000,

  /** Low stock threshold */
  lowStockThreshold: 20,
} as const
