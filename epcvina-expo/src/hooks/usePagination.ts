import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface UsePaginationOptions {
  table: string
  select?: string
  filters?: Record<string, any>
  orderBy?: { column: string; ascending?: boolean }
  pageSize?: number
}

interface UsePaginationResult<T> {
  data: T[]
  loading: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  page: number
}

export function usePagination<T = any>(
  options: UsePaginationOptions
): UsePaginationResult<T> {
  const {
    table,
    select = '*',
    filters = {},
    orderBy,
    pageSize = 20,
  } = options

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchPage = useCallback(async (pageNum: number, reset = false) => {
    if (loading) return

    try {
      setLoading(true)
      setError(null)

      // Build query
      let query = supabase
        .from(table)
        .select(select, { count: 'exact' })

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

      // Apply pagination
      const from = pageNum * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data: result, error: queryError, count } = await query

      if (queryError) throw queryError

      const newData = result as T[]
      
      if (reset) {
        setData(newData)
      } else {
        setData(prev => [...prev, ...newData])
      }

      // Check if there's more data
      const totalFetched = reset ? newData.length : data.length + newData.length
      setHasMore(count ? totalFetched < count : newData.length === pageSize)
      
      setPage(pageNum)
    } catch (err) {
      setError(err as Error)
      console.error('usePagination error:', err)
    } finally {
      setLoading(false)
    }
  }, [table, select, JSON.stringify(filters), orderBy, pageSize, loading])

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return
    await fetchPage(page + 1)
  }, [page, hasMore, loading, fetchPage])

  const refresh = useCallback(async () => {
    setData([])
    setPage(0)
    setHasMore(true)
    await fetchPage(0, true)
  }, [fetchPage])

  // Initial load
  useState(() => {
    fetchPage(0, true)
  })

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    page,
  }
}
