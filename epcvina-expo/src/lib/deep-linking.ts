/**
 * Deep Linking Utilities
 * Handle deep links and universal links
 * 
 * Features:
 * - Parse deep link URLs
 * - Navigate to screens from links
 * - Handle authentication links
 * - Support universal links
 */

import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import { ErrorTracker } from './error-tracking'

/**
 * Deep link configuration
 */
export const DEEP_LINK_CONFIG = {
  scheme: 'epcvina',
  prefixes: [
    'epcvina://',
    'https://epcvina.com',
    'https://*.epcvina.com',
  ],
} as const

/**
 * Deep link routes mapping
 */
export const DEEP_LINK_ROUTES = {
  // Auth
  'auth/login': '/(auth)/login',
  'auth/forgot-password': '/(auth)/forgot-password',
  'auth/reset-password': '/(auth)/reset-password',
  
  // Sales
  'sales/dashboard': '/(sales)/dashboard',
  'sales/customers': '/(sales)/customers',
  'sales/orders': '/(sales)/orders',
  'sales/selling': '/(sales)/selling',
  
  // Customer
  'customer/dashboard': '/(customer)/dashboard',
  'customer/products': '/(customer)/products',
  'customer/orders': '/(customer)/orders',
  
  // Admin
  'admin/dashboard': '/(admin)/dashboard',
  'admin/users': '/(admin)/users',
  
  // Warehouse
  'warehouse/dashboard': '/(warehouse)/dashboard',
  'warehouse/products': '/(warehouse)/products',
} as const

/**
 * Parse deep link URL
 * @param url - Deep link URL
 * @returns Parsed link data
 * 
 * @example
 * ```typescript
 * const data = parseDeepLink('epcvina://sales/customers/123')
 * // { path: 'sales/customers', params: { id: '123' } }
 * ```
 */
export function parseDeepLink(url: string): {
  path: string
  params: Record<string, string>
  queryParams: Record<string, string>
} | null {
  try {
    const parsed = Linking.parse(url)
    
    if (!parsed.path) {
      return null
    }

    // Extract path segments
    const segments = parsed.path.split('/').filter(Boolean)
    
    // Extract params (numeric segments are treated as IDs)
    const params: Record<string, string> = {}
    const pathParts: string[] = []
    
    segments.forEach((segment, index) => {
      if (/^\d+$/.test(segment)) {
        // Numeric segment - treat as ID
        params.id = segment
      } else {
        pathParts.push(segment)
      }
    })

    const path = pathParts.join('/')
    const queryParams = parsed.queryParams || {}

    return {
      path,
      params,
      queryParams: queryParams as Record<string, string>,
    }
  } catch (error) {
    ErrorTracker.logError(error as Error, {
      context: 'parseDeepLink',
      url,
    })
    return null
  }
}

/**
 * Navigate from deep link
 * @param url - Deep link URL
 * @returns Success status
 * 
 * @example
 * ```typescript
 * await navigateFromDeepLink('epcvina://sales/customers/123')
 * ```
 */
export async function navigateFromDeepLink(url: string): Promise<boolean> {
  try {
    const parsed = parseDeepLink(url)
    
    if (!parsed) {
      console.warn('Failed to parse deep link:', url)
      return false
    }

    const { path, params, queryParams } = parsed

    // Find matching route
    const route = DEEP_LINK_ROUTES[path as keyof typeof DEEP_LINK_ROUTES]
    
    if (!route) {
      console.warn('No route found for path:', path)
      return false
    }

    // Build navigation path
    let navigationPath = route
    
    // Add ID param if exists
    if (params.id) {
      navigationPath += `/${params.id}`
    }

    // Add query params
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    
    if (queryString) {
      navigationPath += `?${queryString}`
    }

    // Navigate
    router.push(navigationPath as any)
    
    return true
  } catch (error) {
    ErrorTracker.logError(error as Error, {
      context: 'navigateFromDeepLink',
      url,
    })
    return false
  }
}

/**
 * Create deep link URL
 * @param path - Route path
 * @param params - Route params
 * @param queryParams - Query params
 * @returns Deep link URL
 * 
 * @example
 * ```typescript
 * const url = createDeepLink('sales/customers', { id: '123' })
 * // 'epcvina://sales/customers/123'
 * ```
 */
export function createDeepLink(
  path: string,
  params?: Record<string, string>,
  queryParams?: Record<string, string>
): string {
  let url = `${DEEP_LINK_CONFIG.scheme}://${path}`

  // Add params
  if (params?.id) {
    url += `/${params.id}`
  }

  // Add query params
  if (queryParams && Object.keys(queryParams).length > 0) {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    url += `?${queryString}`
  }

  return url
}

/**
 * Create universal link URL
 * @param path - Route path
 * @param params - Route params
 * @param queryParams - Query params
 * @returns Universal link URL
 * 
 * @example
 * ```typescript
 * const url = createUniversalLink('sales/customers', { id: '123' })
 * // 'https://epcvina.com/sales/customers/123'
 * ```
 */
export function createUniversalLink(
  path: string,
  params?: Record<string, string>,
  queryParams?: Record<string, string>
): string {
  let url = `https://epcvina.com/${path}`

  // Add params
  if (params?.id) {
    url += `/${params.id}`
  }

  // Add query params
  if (queryParams && Object.keys(queryParams).length > 0) {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    url += `?${queryString}`
  }

  return url
}

/**
 * Initialize deep linking
 * Sets up listeners for incoming links
 * 
 * @example
 * ```typescript
 * // In App.tsx or _layout.tsx
 * useEffect(() => {
 *   const cleanup = initDeepLinking()
 *   return cleanup
 * }, [])
 * ```
 */
export function initDeepLinking(): () => void {
  // Handle initial URL (app opened from link)
  Linking.getInitialURL().then((url) => {
    if (url) {
      navigateFromDeepLink(url)
    }
  })

  // Handle incoming URLs (app already open)
  const subscription = Linking.addEventListener('url', (event) => {
    navigateFromDeepLink(event.url)
  })

  // Return cleanup function
  return () => {
    subscription.remove()
  }
}

/**
 * Check if URL can be opened
 * @param url - URL to check
 * @returns Whether URL can be opened
 */
export async function canOpenURL(url: string): Promise<boolean> {
  try {
    return await Linking.canOpenURL(url)
  } catch (error) {
    ErrorTracker.logError(error as Error, {
      context: 'canOpenURL',
      url,
    })
    return false
  }
}

/**
 * Open external URL
 * @param url - URL to open
 * @returns Success status
 * 
 * @example
 * ```typescript
 * await openURL('https://epcvina.com')
 * ```
 */
export async function openURL(url: string): Promise<boolean> {
  try {
    const canOpen = await canOpenURL(url)
    
    if (!canOpen) {
      console.warn('Cannot open URL:', url)
      return false
    }

    await Linking.openURL(url)
    return true
  } catch (error) {
    ErrorTracker.logError(error as Error, {
      context: 'openURL',
      url,
    })
    return false
  }
}

/**
 * Share deep link
 * @param path - Route path
 * @param params - Route params
 * @param message - Share message
 * @returns Success status
 * 
 * @example
 * ```typescript
 * await shareDeepLink('sales/customers', { id: '123' }, 'Check out this customer')
 * ```
 */
export async function shareDeepLink(
  path: string,
  params?: Record<string, string>,
  message?: string
): Promise<boolean> {
  try {
    const { Share } = await import('react-native')
    const url = createUniversalLink(path, params)
    
    const result = await Share.share({
      message: message ? `${message}\n\n${url}` : url,
      url,
    })

    return result.action === Share.sharedAction
  } catch (error) {
    ErrorTracker.logError(error as Error, {
      context: 'shareDeepLink',
      path,
    })
    return false
  }
}
