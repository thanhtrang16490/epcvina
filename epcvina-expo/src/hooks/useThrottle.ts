import { useState, useEffect, useRef } from 'react'

/**
 * Hook để throttle một value
 * Giới hạn số lần update trong một khoảng thời gian
 * 
 * @param value - Value cần throttle
 * @param interval - Interval time in milliseconds
 * @returns Throttled value
 * 
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0)
 * const throttledScrollY = useThrottle(scrollY, 100)
 * 
 * // throttledScrollY chỉ update mỗi 100ms
 * ```
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingValue = useRef<T>(value)
  const isFirstRender = useRef(true)

  useEffect(() => {
    pendingValue.current = value

    if (isFirstRender.current) {
      isFirstRender.current = false
      setThrottledValue(value)
      timeoutId.current = setTimeout(() => {
        timeoutId.current = null
      }, interval)
      return
    }

    if (timeoutId.current === null) {
      // Cooldown expired — update immediately and start new cooldown
      setThrottledValue(value)
      timeoutId.current = setTimeout(() => {
        timeoutId.current = null
      }, interval)
    } else {
      // In cooldown — reschedule trailing update with latest pending value
      clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(() => {
        timeoutId.current = null
        setThrottledValue(pendingValue.current)
      }, interval)
    }
  }, [value, interval])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  return throttledValue
}

/**
 * Hook để throttle một callback function
 * 
 * @param callback - Function cần throttle
 * @param interval - Interval time in milliseconds
 * @returns Throttled callback
 * 
 * @example
 * ```tsx
 * const handleScroll = useThrottledCallback((event) => {
 *   console.log('Scroll position:', event.nativeEvent.contentOffset.y)
 * }, 100)
 * 
 * <ScrollView onScroll={handleScroll} />
 * ```
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number = 500
): (...args: Parameters<T>) => void {
  // Initialize to 0 so the first call always fires immediately
  const lastExecuted = useRef<number>(0)
  const timeoutId = useRef<number | null>(null)

  return (...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecuted.current

    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now
      callback(...args)
    } else {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }

      timeoutId.current = setTimeout(() => {
        lastExecuted.current = Date.now()
        callback(...args)
      }, interval - timeSinceLastExecution)
    }
  }
}
