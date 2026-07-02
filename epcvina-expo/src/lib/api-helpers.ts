import { ErrorTracker, handleApiError } from './error-tracking'
import { OfflineManager } from './offline-manager'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status?: number
}

/**
 * Wrapper cho API calls với error handling và offline support
 */
export async function apiCall<T>(
  fn: () => Promise<T>,
  options?: {
    offlineAction?: string
    offlineData?: any
    context?: string
  }
): Promise<ApiResponse<T>> {
  try {
    const data = await fn()
    return { data, status: 200 }
  } catch (error: any) {
    // Log error
    ErrorTracker.error(error, options?.context || 'apiCall')
    
    // Handle offline
    if (error.message?.includes('network') || error.message?.includes('offline')) {
      if (options?.offlineAction && options?.offlineData) {
        await OfflineManager.queueAction('create', options.offlineAction, options.offlineData)
        return { 
          error: 'Không có kết nối mạng. Hành động sẽ được thực hiện khi có mạng.',
          status: 0 
        }
      }
    }
    
    const errMsg = handleApiError(error)
    return { error: typeof errMsg === 'string' ? errMsg : 'Có lỗi xảy ra', status: error?.status || 500 }
  }
}

/**
 * Retry logic cho API calls
 */
export async function retryApiCall<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }
  
  throw lastError
}
