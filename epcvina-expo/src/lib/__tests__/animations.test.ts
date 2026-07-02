/**
 * Tests for animation utilities
 */

import { Animated } from 'react-native'
import * as Animations from '../animations'

// Mock Animated
const mockStart = jest.fn((callback) => callback && callback())
const mockStop = jest.fn()

jest.mock('react-native', () => ({
  Animated: {
    Value: jest.fn((value) => ({
      setValue: jest.fn(),
      interpolate: jest.fn(() => 'interpolated'),
    })),
    timing: jest.fn(() => ({
      start: mockStart,
    })),
    spring: jest.fn(() => ({
      start: mockStart,
    })),
    loop: jest.fn((animation) => ({
      start: mockStart,
      stop: mockStop,
    })),
    sequence: jest.fn((animations) => ({
      start: mockStart,
    })),
    parallel: jest.fn((animations) => ({
      start: mockStart,
    })),
    stagger: jest.fn((delay, animations) => ({
      start: mockStart,
    })),
  },
  Easing: {
    linear: 'linear',
    ease: 'ease',
    in: jest.fn(() => 'easeIn'),
    out: jest.fn(() => 'easeOut'),
    inOut: jest.fn(() => 'easeInOut'),
    bounce: 'bounce',
    elastic: jest.fn(() => 'elastic'),
  },
}))

describe('Animation Utilities', () => {
  let animatedValue: Animated.Value

  beforeEach(() => {
    jest.clearAllMocks()
    animatedValue = new Animated.Value(0)
  })

  describe('Constants', () => {
    it('should export animation durations', () => {
      expect(Animations.ANIMATION_DURATION.FAST).toBe(150)
      expect(Animations.ANIMATION_DURATION.NORMAL).toBe(250)
      expect(Animations.ANIMATION_DURATION.SLOW).toBe(350)
      expect(Animations.ANIMATION_DURATION.VERY_SLOW).toBe(500)
    })

    it('should export easing functions', () => {
      expect(Animations.EASING.LINEAR).toBeDefined()
      expect(Animations.EASING.EASE).toBeDefined()
      expect(Animations.EASING.EASE_IN).toBeDefined()
      expect(Animations.EASING.EASE_OUT).toBeDefined()
      expect(Animations.EASING.EASE_IN_OUT).toBeDefined()
    })

    it('should export spring configurations', () => {
      expect(Animations.SPRING_CONFIG.DEFAULT).toEqual({
        tension: 40,
        friction: 7,
      })
      expect(Animations.SPRING_CONFIG.BOUNCY).toBeDefined()
      expect(Animations.SPRING_CONFIG.SMOOTH).toBeDefined()
      expect(Animations.SPRING_CONFIG.STIFF).toBeDefined()
    })
  })

  describe('fadeIn', () => {
    it('should create fade in animation', () => {
      Animations.fadeIn(animatedValue)

      expect(Animated.timing).toHaveBeenCalledWith(animatedValue, {
        toValue: 1,
        duration: Animations.ANIMATION_DURATION.NORMAL,
        easing: Animations.EASING.EASE_OUT,
        useNativeDriver: true,
      })
      expect(mockStart).toHaveBeenCalled()
    })

    it('should accept custom parameters', () => {
      const callback = jest.fn()
      Animations.fadeIn(animatedValue, 500, 0.8, callback)

      expect(Animated.timing).toHaveBeenCalledWith(animatedValue, {
        toValue: 0.8,
        duration: 500,
        easing: Animations.EASING.EASE_OUT,
        useNativeDriver: true,
      })
      expect(callback).toHaveBeenCalled()
    })
  })

  describe('fadeOut', () => {
    it('should create fade out animation', () => {
      Animations.fadeOut(animatedValue)

      expect(Animated.timing).toHaveBeenCalledWith(animatedValue, {
        toValue: 0,
        duration: Animations.ANIMATION_DURATION.NORMAL,
        easing: Animations.EASING.EASE_IN,
        useNativeDriver: true,
      })
    })
  })

  describe('slideIn', () => {
    it('should create slide in animation', () => {
      Animations.slideIn(animatedValue)

      expect(Animated.timing).toHaveBeenCalledWith(animatedValue, {
        toValue: 0,
        duration: Animations.ANIMATION_DURATION.NORMAL,
        easing: Animations.EASING.EASE_OUT,
        useNativeDriver: true,
      })
    })
  })

  describe('slideOut', () => {
    it('should create slide out animation', () => {
      Animations.slideOut(animatedValue)

      expect(Animated.timing).toHaveBeenCalledWith(animatedValue, {
        toValue: 100,
        duration: Animations.ANIMATION_DURATION.NORMAL,
        easing: Animations.EASING.EASE_IN,
        useNativeDriver: true,
      })
    })
  })

  describe('scale', () => {
    it('should create scale animation', () => {
      Animations.scale(animatedValue)

      expect(Animated.timing).toHaveBeenCalledWith(animatedValue, {
        toValue: 1,
        duration: Animations.ANIMATION_DURATION.NORMAL,
        easing: Animations.EASING.EASE_OUT,
        useNativeDriver: true,
      })
    })
  })

  describe('spring', () => {
    it('should create spring animation', () => {
      Animations.spring(animatedValue, 1)

      expect(Animated.spring).toHaveBeenCalledWith(animatedValue, {
        toValue: 1,
        ...Animations.SPRING_CONFIG.DEFAULT,
        useNativeDriver: true,
      })
    })

    it('should accept custom config', () => {
      Animations.spring(animatedValue, 1, Animations.SPRING_CONFIG.BOUNCY)

      expect(Animated.spring).toHaveBeenCalledWith(animatedValue, {
        toValue: 1,
        ...Animations.SPRING_CONFIG.BOUNCY,
        useNativeDriver: true,
      })
    })
  })

  describe('pulse', () => {
    it('should create looping pulse animation', () => {
      const animation = Animations.pulse(animatedValue)

      expect(Animated.loop).toHaveBeenCalled()
      expect(Animated.sequence).toHaveBeenCalled()
      expect(animation).toHaveProperty('start')
      expect(animation).toHaveProperty('stop')
    })

    it('should accept custom parameters', () => {
      Animations.pulse(animatedValue, 1000, 0.5, 1.5)

      expect(Animated.loop).toHaveBeenCalled()
    })
  })

  describe('shake', () => {
    it('should create shake animation', () => {
      Animations.shake(animatedValue)

      expect(Animated.sequence).toHaveBeenCalled()
      expect(mockStart).toHaveBeenCalled()
    })

    it('should accept custom parameters', () => {
      const callback = jest.fn()
      Animations.shake(animatedValue, 200, 15, callback)

      expect(Animated.sequence).toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
    })
  })

  describe('rotate', () => {
    it('should create looping rotate animation', () => {
      const animation = Animations.rotate(animatedValue)

      expect(Animated.loop).toHaveBeenCalled()
      expect(animation).toHaveProperty('start')
      expect(animation).toHaveProperty('stop')
    })
  })

  describe('sequence', () => {
    it('should create sequence animation', () => {
      const animations = [
        Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]

      Animations.sequence(animations)

      expect(Animated.sequence).toHaveBeenCalledWith(animations)
      expect(mockStart).toHaveBeenCalled()
    })

    it('should call callback after sequence', () => {
      const callback = jest.fn()
      const animations: any[] = []

      Animations.sequence(animations, callback)

      expect(callback).toHaveBeenCalled()
    })
  })

  describe('parallel', () => {
    it('should create parallel animation', () => {
      const animations = [
        Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]

      Animations.parallel(animations)

      expect(Animated.parallel).toHaveBeenCalledWith(animations)
      expect(mockStart).toHaveBeenCalled()
    })
  })

  describe('stagger', () => {
    it('should create stagger animation', () => {
      const animations = [
        Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]

      Animations.stagger(animations, 100)

      expect(Animated.stagger).toHaveBeenCalledWith(100, animations)
      expect(mockStart).toHaveBeenCalled()
    })

    it('should use default delay', () => {
      const animations: any[] = []

      Animations.stagger(animations)

      expect(Animated.stagger).toHaveBeenCalledWith(100, animations)
    })
  })

  describe('interpolate', () => {
    it('should create interpolation', () => {
      const result = Animations.interpolate(animatedValue, [0, 1], [0, 100])

      expect(animatedValue.interpolate).toHaveBeenCalledWith({
        inputRange: [0, 1],
        outputRange: [0, 100],
      })
      expect(result).toBe('interpolated')
    })

    it('should work with string output', () => {
      Animations.interpolate(animatedValue, [0, 1], ['0deg', '360deg'])

      expect(animatedValue.interpolate).toHaveBeenCalledWith({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      })
    })
  })
})
