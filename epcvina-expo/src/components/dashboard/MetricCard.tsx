import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { LAYOUT } from '../../constants/layout'

const { PADDING: SPACING, RADIUS, ICON: SIZES } = LAYOUT

interface MetricCardProps {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  value: string | number
  color: string
  bg: string
}

/**
 * Card hiển thị metric với icon và value
 * Memoized để tránh re-render không cần thiết
 * 
 * @param title - Tiêu đề của metric
 * @param icon - Icon name từ Ionicons
 * @param value - Giá trị hiển thị
 * @param color - Màu của icon
 * @param bg - Màu nền của icon container
 */
function MetricCardComponent({ title, icon, value, color, bg }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={SIZES.LARGE} color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: RADIUS.LARGE,
    padding: SPACING.MEDIUM,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 160,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.ROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: SPACING.TINY,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
})

/**
 * Memoized version - chỉ re-render khi value thay đổi
 */
export default memo(MetricCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.title === nextProps.title &&
    prevProps.icon === nextProps.icon &&
    prevProps.color === nextProps.color &&
    prevProps.bg === nextProps.bg
  )
})
