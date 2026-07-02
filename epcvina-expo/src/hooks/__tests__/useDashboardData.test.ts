import { renderHook, act, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useDashboardData } from '../useDashboardData'

// Mock supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() =>
        Promise.resolve({
          data: { user: { id: 'user-123', email: 'test@example.com' } },
          error: null,
        })
      ),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        gte: jest.fn(() => ({
          lte: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
        lt: jest.fn(() => Promise.resolve({ data: [], error: null })),
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        order: jest.fn(() => ({
          limit: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        })),
      })),
    })),
  },
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  })

const createWrapper = () => {
  const queryClient = createTestQueryClient()
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useDashboardData', () => {
  const mockProfile = {
    id: 'user-123',
    role: 'sale',
    full_name: 'Test User',
  }

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDashboardData('thisMonth', mockProfile), {
      wrapper: createWrapper(),
    })

    expect(result.current.stats).toEqual({
      orderedCount: 0,
      lowStockCount: 0,
      customerCount: 0,
      totalRevenue: 0,
    })
    expect(result.current.loading).toBe(true)
  })

  it('should fetch data when profile is provided', async () => {
    const { result } = renderHook(() => useDashboardData('thisMonth', mockProfile), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.stats).toBeDefined()
    expect(result.current.recentOrders).toBeDefined()
  })

  it('should refetch data when filter changes', async () => {
    const { result, rerender } = renderHook(
      ({ filter, profile }) => useDashboardData(filter, profile),
      {
        initialProps: { filter: 'thisMonth', profile: mockProfile },
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Change filter
    rerender({ filter: 'today', profile: mockProfile })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should provide refetch function', async () => {
    const { result } = renderHook(() => useDashboardData('thisMonth', mockProfile), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(typeof result.current.refetch).toBe('function')

    // Call refetch - wrap in act() to flush synchronous state updates
    act(() => {
      result.current.refetch()
    })

    expect(result.current.loading).toBe(true)
  })
})
