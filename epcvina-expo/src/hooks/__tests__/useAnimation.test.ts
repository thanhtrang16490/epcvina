/**
 * Tests for animation hooks
 */

import { renderHook } from '@testing-library/react-native'
import { Animated } from 'react-native'
import {
  useFadeIn,
  useSlideIn,
  useScale,
  usePulse,
  useRotate,
  useShake,
  useFadeSlideIn,
} from '../useAnimation'

// Mock Animated and Easing
jest.mock('react-native', () => ({
  Animated: {
    Value: jest.fn((value) => ({
      setValue: jest.fn(),
      interpolate: jest.fn(() => 'interpolated'),
    })),
    timing: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    spring: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    loop: jest.fn((_animation) => ({
      start: jest.fn(),
      stop: jest.fn(),
    })),
    sequence: jest.fn((_animations) => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    parallel: jest.fn((_animations) => ({
      start: jest.fn((callback) => callback && callback()),
    })),
  },
  Easing: {
    linear: jest.fn((t) => t),
    ease: jest.fn((t) => t),
    quad: jest.fn((t) => t),
    cubic: jest.fn((t) => t),
    bezier: jest.fn(() => jest.fn((t) => t)),
    in: jest.fn((fn) => fn),
    out: jest.fn((fn) => fn),
    inOut: jest.fn((fn) => fn),
    back: jest.fn(() => jest.fn((t) => t)),
    bounce: jest.fn((t) => t),
    elastic: jest.fn(() => jest.fn((t) => t)),
    sin: jest.fn((t) => t),
    circle: jest.fn((t) => t),
    exp: jest.fn((t) => t),
    poly: jest.fn(() => jest.fn((t) => t)),
    step0: jest.fn((t) => t),
    step1: jest.fn((t) => t),
  },
}))

describe('Animation Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useFadeIn', () => {
    it('should create animated value and start fade in animation', () => {
      const { result } = renderHook(() => useFadeIn())

      expect(result.current.opacity).toBeDefined()
      expect(Animated.Value).toHaveBeenCalledWith(0)
    })

    it('should accept custom duration', () => {
      renderHook(() => useFadeIn(500))
      expect(Animated.Value).toHaveBeenCalled()
    })
  })

  describe('useSlideIn', () => {
    it('should create animated value with initial position', () => {
      const { result } = renderHook(() => useSlideIn(50))

      expect(result.current.translateY).toBeDefined()
      expect(Animated.Value).toHaveBeenCalledWith(50)
    })

    it('should use default initial value', () => {
      renderHook(() => useSlideIn())
      expect(Animated.Value).toHaveBeenCalledWith(50)
    })
  })

  describe('useScale', () => {
    it('should create animated value with initial scale', () => {
      const { result } = renderHook(() => useScale(0))

      expect(result.current.scale).toBeDefined()
      expect(Animated.Value).toHaveBeenCalledWith(0)
    })

    it('should use default initial value', () => {
      renderHook(() => useScale())
      expect(Animated.Value).toHaveBeenCalledWith(0)
    })
  })

  describe('usePulse', () => {
    it('should create looping pulse animation', () => {
      const { result, unmount } = renderHook(() => usePulse())

      expect(result.current.scale).toBeDefined()
      expect(Animated.Value).toHaveBeenCalledWith(1)
      expect(Animated.loop).toHaveBeenCalled()

      // Cleanup should stop animation
      unmount()
    })

    it('should accept custom parameters', () => {
      renderHook(() => usePulse(1000, 0.5, 1.5))
      expect(Animated.loop).toHaveBeenCalled()
    })
  })

  describe('useRotate', () => {
    it('should create looping rotate animation', () => {
      const { result, unmount } = renderHook(() => useRotate())

      expect(result.current.rotate).toBe('interpolated')
      expect(Animated.Value).toHaveBeenCalledWith(0)
      expect(Animated.loop).toHaveBeenCalled()

      // Cleanup should stop animation
      unmount()
    })

    it('should accept custom duration', () => {
      renderHook(() => useRotate(1000))
      expect(Animated.loop).toHaveBeenCalled()
    })
  })

  describe('useShake', () => {
    it('should return shake function and animated value', () => {
      const { result } = renderHook(() => useShake())

      expect(result.current.shake).toBeInstanceOf(Function)
      expect(result.current.translateX).toBeDefined()
      expect(Animated.Value).toHaveBeenCalledWith(0)
    })

    it('should trigger shake animation when called', () => {
      const { result } = renderHook(() => useShake())

      result.current.shake()
      expect(Animated.sequence).toHaveBeenCalled()
    })

    it('should accept custom parameters', () => {
      const { result } = renderHook(() => useShake())

      result.current.shake(200, 15)
      expect(Animated.sequence).toHaveBeenCalled()
    })
  })

  describe('useFadeSlideIn', () => {
    it('should create combined fade and slide animation', () => {
      const { result } = renderHook(() => useFadeSlideIn())

      expect(result.current.opacity).toBeDefined()
      expect(result.current.translateY).toBeDefined()
      expect(Animated.parallel).toHaveBeenCalled()
    })

    it('should accept custom initial Y and duration', () => {
      renderHook(() => useFadeSlideIn(30, 400))
      expect(Animated.Value).toHaveBeenCalledWith(30)
      expect(Animated.parallel).toHaveBeenCalled()
    })

    it('should use default values', () => {
      renderHook(() => useFadeSlideIn())
      expect(Animated.Value).toHaveBeenCalledWith(20)
    })
  })
})
