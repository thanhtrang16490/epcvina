import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { LAYOUT } from '../../constants/layout'

const { PADDING: SPACING, RADIUS, ICON: SIZES } = LAYOUT

interface QuickActionButtonProps {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
  iconColor: string
  onPress: () => void
}

/**
 * Button cho quick actions trên dashboard
 * Memoized để tránh re-render không cần thiết
 * 
 * @param title - Tiêu đề button
 * @param icon - Icon name từ Ionicons
 * @param color - Màu nền button
 * @param iconColor - Màu icon
 * @param onPress - Handler khi press
 */
function QuickActionButtonComponent({
  title,
  icon,
  color,
  iconColor,
  onPress,
}: QuickActionButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={SIZES.MEDIUM} color={iconColor} />
      <Text style={[styles.buttonText, { color: iconColor }]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    borderRadius: RADIUS.MEDIUM,
    gap: SPACING.SMALL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
})

/**
 * Memoized version - chỉ re-render khi props thay đổi
 */
export default memo(QuickActionButtonComponent)
