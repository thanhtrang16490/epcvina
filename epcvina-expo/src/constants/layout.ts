/**
 * Layout Constants
 * Centralized layout values for consistent spacing and sizing
 */

export const LAYOUT = {
  // Navigation
  TAB_BAR_HEIGHT: 60,
  HEADER_HEIGHT: 56,
  
  // Spacing
  PADDING: {
    TINY: 4,
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 24,
    XLARGE: 32,
  },
  
  // Border Radius
  RADIUS: {
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    XLARGE: 24,
    ROUND: 999,
  },
  
  // Icon Sizes
  ICON: {
    SMALL: 16,
    MEDIUM: 24,
    LARGE: 32,
    XLARGE: 48,
  },
  
  // Touch Targets (minimum 44x44 for accessibility)
  TOUCH_TARGET: {
    MIN: 44,
    COMFORTABLE: 48,
  },
  
  // Container Widths
  CONTAINER: {
    MAX_WIDTH: 1200,
  },
} as const

export type LayoutConstants = typeof LAYOUT
