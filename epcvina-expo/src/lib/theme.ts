// Design tokens for consistent spacing, colors, and typography

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
}

export const colors = {
  // Role colors
  customer: '#10b981',
  sale: '#175ead',
  saleAdmin: '#f59e0b',
  admin: '#ef4444',

  // Neutral
  white: '#ffffff',
  black: '#000000',
  gray: {
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

  // Status
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Background
  background: '#f0f9ff',
  surface: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',
}

export const typography = {
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
}

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
}

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
}

export const layout = {
  containerPadding: spacing.lg,
  cardPadding: spacing.lg,
  sectionGap: spacing.lg,
  itemGap: spacing.md,
}

// Responsive breakpoints
export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
}

// Helper function to get role color
export function getRoleColor(role: string): string {
  switch (role) {
    case 'customer':
      return colors.customer
    case 'sale':
      return colors.sale
    case 'sale_admin':
      return colors.saleAdmin
    case 'admin':
      return colors.admin
    default:
      return colors.gray[500]
  }
}

// Helper function to get status color
export function getStatusColor(status: string): { color: string; bg: string } {
  const statusMap: Record<string, { color: string; bg: string }> = {
    draft: { color: colors.gray[700], bg: colors.gray[100] },
    ordered: { color: '#d97706', bg: '#fef3c7' },
    shipping: { color: colors.info, bg: '#dbeafe' },
    paid: { color: '#9333ea', bg: '#f3e8ff' },
    completed: { color: colors.success, bg: '#d1fae5' },
    cancelled: { color: colors.error, bg: '#fee2e2' },
  }
  return statusMap[status] || statusMap.draft
}
