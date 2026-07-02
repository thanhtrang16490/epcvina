/**
 * StatusBadge
 * Shared component for displaying order/item status.
 * Replaces duplicated statusMap definitions across dashboard screens.
 */

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { OrderStatus } from '../../types'

// ─── Status config map ────────────────────────────────────────────────────────

export interface StatusConfig {
  label: string
  color: string
  bg: string
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  draft:     { label: 'Nháp',        color: '#374151', bg: '#f3f4f6' },
  ordered:   { label: 'Đặt hàng',    color: '#d97706', bg: '#fef3c7' },
  shipping:  { label: 'Giao hàng',   color: '#2563eb', bg: '#dbeafe' },
  paid:      { label: 'Thanh toán',  color: '#9333ea', bg: '#f3e8ff' },
  completed: { label: 'Hoàn thành',  color: '#059669', bg: '#d1fae5' },
  cancelled: { label: 'Đã hủy',      color: '#dc2626', bg: '#fee2e2' },
}

/**
 * Get status config for a given status string.
 * Falls back to 'draft' config for unknown statuses.
 */
export function getStatusConfig(status: string): StatusConfig {
  return ORDER_STATUS_CONFIG[status as OrderStatus] ?? ORDER_STATUS_CONFIG.draft
}

// ─── Component ────────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = getStatusConfig(status)
  const isSmall = size === 'sm'

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isSmall && styles.badgeSm,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: config.color },
          isSmall && styles.textSm,
        ]}
      >
        {config.label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 10,
    fontWeight: '500',
  },
})
