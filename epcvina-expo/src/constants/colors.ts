/**
 * Color Constants
 * Centralized color palette for consistent theming
 */

export const COLORS = {
  // Primary Colors
  PRIMARY: {
    DEFAULT: '#175ead',
    LIGHT: '#dbeafe',
    DARK: '#0c3d6e',
  },
  
  // Secondary Colors
  SECONDARY: {
    DEFAULT: '#6366f1',
    LIGHT: '#e0e7ff',
    DARK: '#4338ca',
  },
  
  // Status Colors
  SUCCESS: {
    DEFAULT: '#10b981',
    LIGHT: '#d1fae5',
    DARK: '#059669',
  },
  
  WARNING: {
    DEFAULT: '#f59e0b',
    LIGHT: '#fef3c7',
    DARK: '#d97706',
  },
  
  ERROR: {
    DEFAULT: '#ef4444',
    LIGHT: '#fee2e2',
    DARK: '#dc2626',
  },
  
  INFO: {
    DEFAULT: '#2563eb',
    LIGHT: '#dbeafe',
    DARK: '#1e40af',
  },
  
  // Neutral Colors
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Role-specific Colors
  ROLE: {
    ADMIN: '#ef4444',
    SALE_ADMIN: '#175ead',
    SALE: '#175ead',
    WAREHOUSE: '#f59e0b',
    CUSTOMER: '#10b981',
  },
  
  // Background Colors
  BACKGROUND: {
    PRIMARY: '#ffffff',
    SECONDARY: '#f0f9ff',
    TERTIARY: '#f9fafb',
  },
  
  // Text Colors
  TEXT: {
    PRIMARY: '#111827',
    SECONDARY: '#6b7280',
    TERTIARY: '#9ca3af',
    INVERSE: '#ffffff',
  },
  
  // Border Colors
  BORDER: {
    DEFAULT: '#e5e7eb',
    LIGHT: '#f3f4f6',
    DARK: '#d1d5db',
  },
  
  // Special Colors
  WHITE: '#ffffff',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
} as const

export type ColorConstants = typeof COLORS

/**
 * Get role color
 */
export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'admin':
      return COLORS.ROLE.ADMIN
    case 'sale_admin':
      return COLORS.ROLE.SALE_ADMIN
    case 'sale':
      return COLORS.ROLE.SALE
    case 'warehouse':
      return COLORS.ROLE.WAREHOUSE
    case 'customer':
      return COLORS.ROLE.CUSTOMER
    default:
      return COLORS.PRIMARY.DEFAULT
  }
}

/**
 * Get status color
 */
export const getStatusColor = (status: string): { color: string; bg: string } => {
  const statusMap: Record<string, { color: string; bg: string }> = {
    draft: { color: COLORS.GRAY[700], bg: COLORS.GRAY[100] },
    ordered: { color: COLORS.WARNING.DARK, bg: COLORS.WARNING.LIGHT },
    shipping: { color: COLORS.INFO.DARK, bg: COLORS.INFO.LIGHT },
    paid: { color: COLORS.SECONDARY.DARK, bg: COLORS.SECONDARY.LIGHT },
    completed: { color: COLORS.SUCCESS.DARK, bg: COLORS.SUCCESS.LIGHT },
    cancelled: { color: COLORS.ERROR.DARK, bg: COLORS.ERROR.LIGHT },
  }
  
  return statusMap[status] || statusMap.draft
}
