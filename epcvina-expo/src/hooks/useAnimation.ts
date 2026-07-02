import { useRef, useEffect } from 'react'
import { Animated } from 'react-native'
import * as Animations from '../lib/animations'

/**
 * Hook for fade in animation
 * @param duration - Animation duration
 * @returns Animated value and opacity style
 * 
 * @example
 * ```tsx
 * const { opacity } = useFadeIn()
 * return <Animated.View style={{ opacity }}>...</Animated.View>
 * ```
 */
export function useFadeIn(duration?: number) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animations.fadeIn(opacity, duration)
  }, [])

  return { opacity }
}

/**
 * Hook for slide in animation
 * @param initialValue - Initial position
 * @param duration - Animation duration
 * @returns Animated value and transform style
 * 
 * @example
 * ```tsx
 * const { translateY } = useSlideIn(50)
 * return <Animated.View style={{ transform: [{ translateY }] }}>...</Animated.View>
 * ```
 */
export function useSlideIn(initialValue: number = 50, duration?: number) {
  const translateY = useRef(new Animated.Value(initialValue)).current

  useEffect(() => {
    Animations.slideIn(translateY, duration)
  }, [])

  return { translateY }
}

/**
 * Hook for scale animation
 * @param initialValue - Initial scale
 * @param duration - Animation duration
 * @returns Animated value and transform style
 * 
 * @example
 * ```tsx
 * const { scale } = useScale(0)
 * return <Animated.View style={{ transform: [{ scale }] }}>...</Animated.View>
 * ```
 */
export function useScale(initialValue: number = 0, duration?: number) {
  const scale = useRef(new Animated.Value(initialValue)).current

  useEffect(() => {
    Animations.scale(scale, duration)
  }, [])

  return { scale }
}

/**
 * Hook for pulse animation (loop)
 * @param duration - Animation duration
 * @param minValue - Minimum scale
 * @param maxValue - Maximum scale
 * @returns Animated value
 * 
 * @example
 * ```tsx
 * const { scale } = usePulse()
 * return <Animated.View style={{ transform: [{ scale }] }}>...</Animated.View>
 * ```
 */
export function usePulse(duration?: number, minValue?: number, maxValue?: number) {
  const scale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const animation = Animations.pulse(scale, duration, minValue, maxValue)
    animation.start()

    return () => {
      animation.stop()
    }
  }, [])

  return { scale }
}

/**
 * Hook for rotate animation (loop)
 * @param duration - Animation duration
 * @returns Animated value and rotation style
 * 
 * @example
 * ```tsx
 * const { rotate } = useRotate()
 * return <Animated.View style={{ transform: [{ rotate }] }}>...</Animated.View>
 * ```
 */
export function useRotate(duration?: number) {
  const rotateValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animations.rotate(rotateValue, duration)
    animation.start()

    return () => {
      animation.stop()
    }
  }, [])

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return { rotate }
}

/**
 * Hook for shake animation
 * @returns Shake function and animated value
 * 
 * @example
 * ```tsx
 * const { shake, translateX } = useShake()
 * 
 * const handleError = () => {
 *   shake()
 * }
 * 
 * return <Animated.View style={{ transform: [{ translateX }] }}>...</Animated.View>
 * ```
 */
export function useShake() {
  const translateX = useRef(new Animated.Value(0)).current

  const shake = (duration?: number, intensity?: number) => {
    Animations.shake(translateX, duration, intensity)
  }

  return { shake, translateX }
}

/**
 * Hook for combined fade + slide animation
 * @param initialY - Initial Y position
 * @param duration - Animation duration
 * @returns Animated values
 * 
 * @example
 * ```tsx
 * const { opacity, translateY } = useFadeSlideIn()
 * return (
 *   <Animated.View style={{ opacity, transform: [{ translateY }] }}>
 *     ...
 *   </Animated.View>
 * )
 * ```
 */
export function useFadeSlideIn(initialY: number = 20, duration?: number) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(initialY)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration || Animations.ANIMATION_DURATION.NORMAL,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: duration || Animations.ANIMATION_DURATION.NORMAL,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return { opacity, translateY }
}
