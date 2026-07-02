import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Hook để debounce một value
 * Hữu ích cho search inputs, API calls, etc.
 * 
 * @param value - Value cần debounce
 * @param delay - Delay time in milliseconds
 * @returns Debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 500)
 * 
 * useEffect(() => {
 *   // API call với debounced value
 *   fetchResults(debouncedSearch)
 * }, [debouncedSearch])
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set timeout để update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup timeout nếu value thay đổi trước khi delay hết
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook để debounce một callback function
 * 
 * @param callback - Function cần debounce
 * @param delay - Delay time in milliseconds
 * @returns Debounced callback
 * 
 * @example
 * ```tsx
 * const handleSearch = useDebouncedCallback((term: string) => {
 *   fetchResults(term)
 * }, 500)
 * 
 * <TextInput onChangeText={handleSearch} />
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<number | null>(null)
  const callbackRef = useRef<T>(callback)

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
        timeoutRef.current = null
      }, delay) as unknown as number
    },
    [delay]
  )
}
