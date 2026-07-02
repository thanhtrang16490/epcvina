import { useState, useEffect } from 'react'
import { Dimensions, ScaledSize } from 'react-native'

interface ResponsiveValues {
  isPhone: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  columns: number
  containerWidth: number | string
}

const BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
}

export function useResponsive(): ResponsiveValues {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'))

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window)
    })

    return () => subscription?.remove()
  }, [])

  const { width, height } = dimensions
  const isPhone = width < BREAKPOINTS.tablet
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop
  const isDesktop = width >= BREAKPOINTS.desktop
  const orientation = width > height ? 'landscape' : 'portrait'

  // Grid columns based on device
  const columns = isPhone ? 2 : isTablet ? 3 : 4

  // Container width for centered content
  const containerWidth = isDesktop ? 1200 : isTablet ? '90%' : '100%'

  return {
    isPhone,
    isTablet,
    isDesktop,
    width,
    height,
    orientation,
    columns,
    containerWidth,
  }
}

// Helper function to get responsive value
export function responsive<T>(values: {
  phone?: T
  tablet?: T
  desktop?: T
  default: T
}): T {
  const { isPhone, isTablet, isDesktop } = useResponsive()

  if (isDesktop && values.desktop !== undefined) return values.desktop
  if (isTablet && values.tablet !== undefined) return values.tablet
  if (isPhone && values.phone !== undefined) return values.phone

  return values.default
}

// Helper to scale font size
export function scaleFontSize(size: number): number {
  const { width } = useResponsive()
  const baseWidth = 375 // iPhone X width
  const scale = width / baseWidth
  return Math.round(size * scale)
}

// Helper to get spacing
export function getSpacing(base: number): number {
  const { isTablet, isDesktop } = useResponsive()
  
  if (isDesktop) return base * 1.5
  if (isTablet) return base * 1.25
  return base
}
