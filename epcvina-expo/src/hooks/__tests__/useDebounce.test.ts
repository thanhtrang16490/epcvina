import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useDebounce, useDebouncedCallback } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: 500 })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Value should be updated after delay
    await waitFor(() => {
      expect(result.current).toBe('updated')
    })
  })

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 'initial' },
      }
    )

    // Rapid changes
    rerender({ value: 'change1' })
    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({ value: 'change2' })
    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({ value: 'final' })
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Should only have the final value
    await waitFor(() => {
      expect(result.current).toBe('final')
    })
  })
})

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should debounce callback execution', () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 500))

    // Call multiple times
    act(() => {
      result.current('arg1')
      result.current('arg2')
      result.current('arg3')
    })

    // Callback should not be called yet
    expect(callback).not.toHaveBeenCalled()

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Callback should be called once with last arguments
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('arg3')
  })
})
