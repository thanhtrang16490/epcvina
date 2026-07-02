/**
 * Error Tracking & Monitoring
 * Centralized error handling and logging.
 *
 * To enable Sentry in production:
 * 1. Install: npx expo install @sentry/react-native
 * 2. Set EXPO_PUBLIC_SENTRY_DSN in .env
 * 3. Uncomment Sentry code blocks below
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

// import * as Sentry from '@sentry/react-native'

const ERROR_LOGS_KEY = '@epcvina:error_logs'
const MAX_STORED_ERRORS = 50

export interface ErrorContext {
  userId?: string
  screen?: string
  action?: string
  [key: string]: unknown
}

interface StoredError {
  timestamp: string
  message: string
  stack?: string
  context?: ErrorContext
}

class ErrorTrackerService {
  private isInitialized = false
  private currentUser: { id?: string; email?: string; role?: string } = {}

  /**
   * Initialize error tracking service.
   * Call once at app startup.
   */
  init(): void {
    if (this.isInitialized) return

    // Sentry.init({
    //   dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    //   enableAutoSessionTracking: true,
    //   tracesSampleRate: __DEV__ ? 0 : 1.0,
    //   environment: __DEV__ ? 'development' : 'production',
    // })

    this.isInitialized = true
    if (__DEV__) console.log('[ErrorTracker] Initialized')
  }

  /**
   * Log an error with optional context.
   */
  logError(error: Error | unknown, context?: ErrorContext): void {
    const err = error instanceof Error ? error : new Error(String(error))

    if (__DEV__) {
      console.error('[ErrorTracker] Error:', err.message, context ?? '')
      if (err.stack) console.error(err.stack)
    }

    // Sentry.captureException(err, { extra: context })
    this.storeErrorLocally(err, context)
  }

  /**
   * Alias for logError - compatible with ErrorTracker.error() call pattern.
   */
  error(error: Error | unknown, contextOrAction?: ErrorContext | string): void {
    const context: ErrorContext | undefined =
      typeof contextOrAction === 'string'
        ? { action: contextOrAction }
        : contextOrAction
    this.logError(error, context)
  }

  /**
   * Log a warning message.
   */
  logWarning(message: string, context?: ErrorContext): void {
    if (__DEV__) {
      console.warn('[ErrorTracker] Warning:', message, context ?? '')
    }

    // Sentry.addBreadcrumb({ message, level: 'warning', data: context })
  }

  /**
   * Log an informational message.
   */
  logInfo(message: string, context?: ErrorContext): void {
    if (__DEV__) {
      console.log('[ErrorTracker] Info:', message, context ?? '')
    }

    // Sentry.addBreadcrumb({ message, level: 'info', data: context })
  }

  /**
   * Set the current user context for error reports.
   */
  setUser(userId: string, email?: string, role?: string): void {
    this.currentUser = { id: userId, email, role }

    // Sentry.setUser({ id: userId, email, username: role })

    if (__DEV__) {
      console.log('[ErrorTracker] User set:', { userId, role })
    }
  }

  /**
   * Clear user context (call on logout).
   */
  clearUser(): void {
    this.currentUser = {}

    // Sentry.setUser(null)

    if (__DEV__) {
      console.log('[ErrorTracker] User cleared')
    }
  }

  /**
   * Store error locally in AsyncStorage for offline debugging.
   */
  private async storeErrorLocally(error: Error, context?: ErrorContext): Promise<void> {
    try {
      const newEntry: StoredError = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        context: {
          ...context,
          userId: context?.userId ?? this.currentUser.id,
        },
      }

      const raw = await AsyncStorage.getItem(ERROR_LOGS_KEY)
      const logs: StoredError[] = raw ? JSON.parse(raw) : []
      logs.push(newEntry)

      // Keep only the last N errors
      const trimmed = logs.slice(-MAX_STORED_ERRORS)
      await AsyncStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(trimmed))
    } catch {
      // Silently fail - don't cause infinite error loops
    }
  }

  /**
   * Retrieve stored error logs (for debugging / support).
   */
  async getErrorLogs(): Promise<StoredError[]> {
    try {
      const raw = await AsyncStorage.getItem(ERROR_LOGS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  /**
   * Clear all stored error logs.
   */
  async clearErrorLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ERROR_LOGS_KEY)
      if (__DEV__) console.log('[ErrorTracker] Error logs cleared')
    } catch {
      // Silently fail
    }
  }
}

// ─── Singleton exports ────────────────────────────────────────────────────────

export const errorTracker = new ErrorTrackerService()

/**
 * Static-style alias so callers can use `ErrorTracker.error(...)` pattern.
 */
export const ErrorTracker = errorTracker

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Wrap an async function with automatic error tracking.
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      errorTracker.logError(error as Error, context)
      throw error
    }
  }) as T
}

/**
 * Extract a human-readable message from an API error response.
 */
export function handleApiError(error: unknown, defaultMessage = 'Có lỗi xảy ra'): string {
  if (error && typeof error === 'object') {
    if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
      return (error as { message: string }).message
    }
    if ('error' in error && typeof (error as { error: unknown }).error === 'string') {
      return (error as { error: string }).error
    }
  }
  return defaultMessage
}
