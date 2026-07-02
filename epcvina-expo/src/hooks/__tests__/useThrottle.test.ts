import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useThrottle, useThrottledCallback } from '../useThrottle'

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should throttle value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, interval }) => useThrottle(value, interval),
      {
        initialProps: { value: 'initial', interval: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', interval: 500 })

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Value should be updated after interval
    await waitFor(() => {
      expect(result.current).toBe('updated')
    })
  })

  it('should limit updates within interval', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 500),
      {
        initialProps: { value: 0 },
      }
    )

    // Rapid updates
    for (let i = 1; i <= 10; i++) {
      rerender({ value: i })
      act(() => {
        jest.advanceTimersByTime(50)
      })
    }

    // Should not update on every change
    expect(result.current).toBeLessThan(10)
  })
})

describe('useThrottledCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should throttle callback execution', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useThrottledCallback(callback, 500))

    // Call multiple times rapidly
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current(i)
      }
    })

    // Callback should be called immediately for first call
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(0)

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Should be called again after interval
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
