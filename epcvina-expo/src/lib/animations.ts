/**
 * Animation Utilities
 * Reusable animation configurations và helpers
 * 
 * Features:
 * - Predefined animations
 * - Timing functions
 * - Animation sequences
 * - Spring configurations
 */

import { Animated, Easing } from 'react-native'

/**
 * Animation durations
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  VERY_SLOW: 500,
} as const

/**
 * Easing functions
 */
export const EASING = {
  LINEAR: Easing.linear,
  EASE: Easing.ease,
  EASE_IN: Easing.in(Easing.ease),
  EASE_OUT: Easing.out(Easing.ease),
  EASE_IN_OUT: Easing.inOut(Easing.ease),
  BOUNCE: Easing.bounce,
  ELASTIC: Easing.elastic(1),
} as const

/**
 * Spring configurations
 */
export const SPRING_CONFIG = {
  DEFAULT: {
    tension: 40,
    friction: 7,
  },
  BOUNCY: {
    tension: 50,
    friction: 5,
  },
  SMOOTH: {
    tension: 30,
    friction: 10,
  },
  STIFF: {
    tension: 100,
    friction: 10,
  },
} as const

/**
 * Fade in animation
 * @param animatedValue - Animated value
 * @param duration - Animation duration
 * @param toValue - Target value (default: 1)
 * @param callback - Callback after animation
 */
export function fadeIn(
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 1,
  callback?: () => void
) {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING.EASE_OUT,
    useNativeDriver: true,
  }).start(callback)
}

/**
 * Fade out animation
 * @param animatedValue - Animated value
 * @param duration - Animation duration
 * @param toValue - Target value (default: 0)
 * @param callback - Callback after animation
 */
export function fadeOut(
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 0,
  callback?: () => void
) {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING.EASE_IN,
    useNativeDriver: true,
  }).start(callback)
}

/**
 * Slide in animation
 * @param animatedValue - Animated value
 * @param duration - Animation duration
 * @param toValue - Target value (default: 0)
 * @param callback - Callback after animation
 */
export function slideIn(
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 0,
  callback?: () => void
) {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING.EASE_OUT,
    useNativeDriver: true,
  }).start(callback)
}

/**
 * Slide out animation
 * @param animatedValue - Animated value
 * @param duration - Animation duration
 * @param toValue - Target value
 * @param callback - Callback after animation
 */
export function slideOut(
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 100,
  callback?: () => void
) {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING.EASE_IN,
    useNativeDriver: true,
  }).start(callback)
}

/**
 * Scale animation
 * @param animatedValue - Animated value
 * @param duration - Animation duration
 * @param toValue - Target scale (default: 1)
 * @param callback - Callback after animation
 */
export function scale(
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.NORMAL,
  toValue: number = 1,
  callback?: () => void
) {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING.EASE_OUT,
    useNativeDriver: true,
  }).start(callback)
}

/**
 * Spring animation
 * @param animatedValue - Animated value
 * @param toValue - Target value
 * @param config - Spring configuration
 * @param callback - Callback after animation
 */
export function spring(
  animatedValue: Animated.Value,
  toValue: number,
  config: { tension: number; friction: number } = SPRING_CONFIG.DEFAULT,
  callback?: () => void
) {
  Animated.spring(animatedValue, {
    toValue,
    ...config,
    useNativeDriver: true,
  }).start(callback)
}

/**
 * Pulse animation (loop)
 * @param animatedValue - Animated value
 * @param duration - Animation duration
 * @param minValue - Minimum value
 * @param maxValue - Maximum value
 * @returns Animation instance (call .stop() to stop)
 */
export function pulse(
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.SLOW,
  minValue: number = 0.8,
  maxValue: number = 1
) {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxValue,
        duration: duration / 2,
        easing: EASING.EASE_IN_OUT,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minValue,
        duration: duration / 2,
        easing: EASING.EASE_IN_OUT,
        useNativeDriver: true,
      }),
    ])
  )
}

/**
 * Shake animation
 * @param animatedValue - Animated value
 * @param duration - Animation duration
 * @param intensity - Shake intensity
 * @param callback - Callback after animation
 */
export function shake(
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.FAST,
  intensity: number = 10,
  callback?: () => void
) {
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: intensity,
      duration: duration / 4,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -intensity,
      duration: duration / 4,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: intensity / 2,
      duration: duration / 4,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: duration / 4,
      useNativeDriver: true,
    }),
  ]).start(callback)
}

/**
 * Rotate animation (loop)
 * @param animatedValue - Animated value (0 to 1)
 * @param duration - Animation duration
 * @returns Animation instance
 */
export function rotate(
  animatedValue: Animated.Value,
  duration: number = ANIMATION_DURATION.SLOW
) {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: EASING.LINEAR,
      useNativeDriver: true,
    })
  )
}

/**
 * Sequence animation
 * @param animations - Array of animations
 * @param callback - Callback after sequence
 */
export function sequence(animations: Animated.CompositeAnimation[], callback?: () => void) {
  Animated.sequence(animations).start(callback)
}

/**
 * Parallel animation
 * @param animations - Array of animations
 * @param callback - Callback after all animations
 */
export function parallel(animations: Animated.CompositeAnimation[], callback?: () => void) {
  Animated.parallel(animations).start(callback)
}

/**
 * Stagger animation
 * @param animations - Array of animations
 * @param delay - Delay between animations
 * @param callback - Callback after all animations
 */
export function stagger(
  animations: Animated.CompositeAnimation[],
  delay: number = 100,
  callback?: () => void
) {
  Animated.stagger(delay, animations).start(callback)
}

/**
 * Create interpolation
 * @param animatedValue - Animated value
 * @param inputRange - Input range
 * @param outputRange - Output range
 * @returns Interpolated value
 */
export function interpolate(
  animatedValue: Animated.Value,
  inputRange: number[],
  outputRange: number[] | string[]
) {
  return animatedValue.interpolate({
    inputRange,
    outputRange,
  })
}
