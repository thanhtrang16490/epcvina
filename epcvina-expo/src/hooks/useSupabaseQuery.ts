import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { cache } from '../lib/cache'

interface UseSupabaseQueryOptions<T> {
  table: string
  select?: string
  filters?: Record<string, any>
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
  enabled?: boolean
  cacheKey?: string
  cacheDuration?: number
  staleTime?: number // Time before cache is considered stale (default: 5 min)
}

interface UseSupabaseQueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  isStale: boolean
}

export function useSupabaseQuery<T = any>(
  options: UseSupabaseQueryOptions<T>
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isStale, setIsStale] = useState(false)

  const {
    table,
    select = '*',
    filters = {},
    orderBy,
    limit,
    enabled = true,
    cacheKey,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      // Try cache first (only if not forcing refresh)
      if (cacheKey && !forceRefresh) {
        const cached = await cache.get<T>(cacheKey)
        if (cached) {
          setData(cached)
          setIsStale(false)
          setLoading(false)
          
          // Fetch fresh data in background if stale
          const cacheAge = Date.now() - (await getCacheAge(cacheKey))
          if (cacheAge > staleTime) {
            setIsStale(true)
            fetchFreshData()
          }
          return
        }
      }

      await fetchFreshData()
    } catch (err) {
      setError(err as Error)
      console.error('useSupabaseQuery error:', err)
    } finally {
      setLoading(false)
    }
  }, [table, select, JSON.stringify(filters), orderBy, limit, enabled, cacheKey, staleTime])

  const fetchFreshData = async () => {
    // Build query
    let query = supabase.from(table).select(select)

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value)
        } else {
          query = query.eq(key, value)
        }
      }
    })

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit)
    }

    const { data: result, error: queryError } = await query

    if (queryError) throw queryError

    setData(result as T)
    setIsStale(false)

    // Cache result
    if (cacheKey && result) {
      await cache.set(cacheKey, result)
    }
  }

  const getCacheAge = async (key: string): Promise<number> => {
    try {
      const cached = await cache.get<any>(key)
      return cached ? Date.now() : 0
    } catch {
      return 0
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(async () => {
    await fetchData(true)
  }, [fetchData])

  return { data, loading, error, refetch, isStale }
}
