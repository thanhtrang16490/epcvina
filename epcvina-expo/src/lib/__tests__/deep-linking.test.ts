/**
 * Tests for deep linking utilities
 */

import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import {
  parseDeepLink,
  navigateFromDeepLink,
  createDeepLink,
  createUniversalLink,
  canOpenURL,
  openURL,
  DEEP_LINK_CONFIG,
  DEEP_LINK_ROUTES,
} from '../deep-linking'

// Mock expo-linking
jest.mock('expo-linking', () => ({
  parse: jest.fn(),
  getInitialURL: jest.fn(),
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
}))

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}))

// Mock error tracking
jest.mock('../error-tracking', () => ({
  ErrorTracker: {
    logError: jest.fn(),
  },
}))

describe('Deep Linking Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Configuration', () => {
    it('should export deep link config', () => {
      expect(DEEP_LINK_CONFIG.scheme).toBe('epcvina')
      expect(DEEP_LINK_CONFIG.prefixes).toContain('epcvina://')
      expect(DEEP_LINK_CONFIG.prefixes).toContain('https://epcvina.com')
    })

    it('should export route mappings', () => {
      expect(DEEP_LINK_ROUTES['auth/login']).toBe('/(auth)/login')
      expect(DEEP_LINK_ROUTES['sales/dashboard']).toBe('/(sales)/dashboard')
      expect(DEEP_LINK_ROUTES['customer/dashboard']).toBe('/(customer)/dashboard')
    })
  })

  describe('parseDeepLink', () => {
    it('should parse simple deep link', () => {
      ;(Linking.parse as jest.Mock).mockReturnValue({
        path: 'sales/dashboard',
        queryParams: {},
      })

      const result = parseDeepLink('epcvina://sales/dashboard')

      expect(result).toEqual({
        path: 'sales/dashboard',
        params: {},
        queryParams: {},
      })
    })

    it('should parse deep link with ID', () => {
      ;(Linking.parse as jest.Mock).mockReturnValue({
        path: 'sales/customers/123',
        queryParams: {},
      })

      const result = parseDeepLink('epcvina://sales/customers/123')

      expect(result).toEqual({
        path: 'sales/customers',
        params: { id: '123' },
        queryParams: {},
      })
    })

    it('should parse deep link with query params', () => {
      ;(Linking.parse as jest.Mock).mockReturnValue({
        path: 'sales/customers',
        queryParams: { search: 'john', page: '2' },
      })

      const result = parseDeepLink('epcvina://sales/customers?search=john&page=2')

      expect(result).toEqual({
        path: 'sales/customers',
        params: {},
        queryParams: { search: 'john', page: '2' },
      })
    })

    it('should return null for invalid URL', () => {
      ;(Linking.parse as jest.Mock).mockReturnValue({
        path: null,
      })

      const result = parseDeepLink('invalid')

      expect(result).toBeNull()
    })

    it('should handle parsing errors', () => {
      ;(Linking.parse as jest.Mock).mockImplementation(() => {
        throw new Error('Parse error')
      })

      const result = parseDeepLink('epcvina://invalid')

      expect(result).toBeNull()
    })
  })

  describe('navigateFromDeepLink', () => {
    it('should navigate to parsed route', async () => {
      ;(Linking.parse as jest.Mock).mockReturnValue({
        path: 'sales/dashboard',
        queryParams: {},
      })

      const result = await navigateFromDeepLink('epcvina://sales/dashboard')

      expect(result).toBe(true)
      expect(router.push).toHaveBeenCalledWith('/(sales)/dashboard')
    })

    it('should navigate with ID param', async () => {
      ;(Linking.parse as jest.Mock).mockReturnValue({
        path: 'sales/customers/123',
        queryParams: {},
      })

      const result = await navigateFromDeepLink('epcvina://sales/customers/123')

      expect(result).toBe(true)
      expect(router.push).toHaveBeenCalledWith('/(sales)/customers/123')
    })

    it('should navigate with query params', async () => {
      ;(Linking.parse as jest.Mock).mockReturnValue({
        path: 'sales/customers',
        queryParams: { search: 'john' },
      })

      const result = await navigateFromDeepLink('epcvina://sales/customers?search=john')

      expect(result).toBe(true)
      expect(router.push).toHaveBeenCalledWith('/(sales)/customers?search=john')
    })

    it('should return false for unknown route', async () => {
      ;(Linking.parse as jest.Mock).mockReturnValue({
        path: 'unknown/route',
        queryParams: {},
      })

      const result = await navigateFromDeepLink('epcvina://unknown/route')

      expect(result).toBe(false)
      expect(router.push).not.toHaveBeenCalled()
    })

    it('should return false for invalid URL', async () => {
      ;(Linking.parse as jest.Mock).mockReturnValue({
        path: null,
      })

      const result = await navigateFromDeepLink('invalid')

      expect(result).toBe(false)
    })
  })

  describe('createDeepLink', () => {
    it('should create simple deep link', () => {
      const url = createDeepLink('sales/dashboard')

      expect(url).toBe('epcvina://sales/dashboard')
    })

    it('should create deep link with ID', () => {
      const url = createDeepLink('sales/customers', { id: '123' })

      expect(url).toBe('epcvina://sales/customers/123')
    })

    it('should create deep link with query params', () => {
      const url = createDeepLink('sales/customers', undefined, { search: 'john', page: '2' })

      expect(url).toBe('epcvina://sales/customers?search=john&page=2')
    })

    it('should create deep link with ID and query params', () => {
      const url = createDeepLink('sales/customers', { id: '123' }, { tab: 'orders' })

      expect(url).toBe('epcvina://sales/customers/123?tab=orders')
    })

    it('should encode query params', () => {
      const url = createDeepLink('sales/customers', undefined, { search: 'john doe' })

      expect(url).toBe('epcvina://sales/customers?search=john%20doe')
    })
  })

  describe('createUniversalLink', () => {
    it('should create simple universal link', () => {
      const url = createUniversalLink('sales/dashboard')

      expect(url).toBe('https://epcvina.com/sales/dashboard')
    })

    it('should create universal link with ID', () => {
      const url = createUniversalLink('sales/customers', { id: '123' })

      expect(url).toBe('https://epcvina.com/sales/customers/123')
    })

    it('should create universal link with query params', () => {
      const url = createUniversalLink('sales/customers', undefined, { search: 'john' })

      expect(url).toBe('https://epcvina.com/sales/customers?search=john')
    })
  })

  describe('canOpenURL', () => {
    it('should return true if URL can be opened', async () => {
      ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)

      const result = await canOpenURL('https://epcvina.com')

      expect(result).toBe(true)
      expect(Linking.canOpenURL).toHaveBeenCalledWith('https://epcvina.com')
    })

    it('should return false if URL cannot be opened', async () => {
      ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(false)

      const result = await canOpenURL('invalid://url')

      expect(result).toBe(false)
    })

    it('should handle errors', async () => {
      ;(Linking.canOpenURL as jest.Mock).mockRejectedValue(new Error('Error'))

      const result = await canOpenURL('https://epcvina.com')

      expect(result).toBe(false)
    })
  })

  describe('openURL', () => {
    it('should open URL if possible', async () => {
      ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)
      ;(Linking.openURL as jest.Mock).mockResolvedValue(undefined)

      const result = await openURL('https://epcvina.com')

      expect(result).toBe(true)
      expect(Linking.openURL).toHaveBeenCalledWith('https://epcvina.com')
    })

    it('should return false if URL cannot be opened', async () => {
      ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(false)

      const result = await openURL('invalid://url')

      expect(result).toBe(false)
      expect(Linking.openURL).not.toHaveBeenCalled()
    })

    it('should handle errors', async () => {
      ;(Linking.canOpenURL as jest.Mock).mockResolvedValue(true)
      ;(Linking.openURL as jest.Mock).mockRejectedValue(new Error('Error'))

      const result = await openURL('https://epcvina.com')

      expect(result).toBe(false)
    })
  })
})
