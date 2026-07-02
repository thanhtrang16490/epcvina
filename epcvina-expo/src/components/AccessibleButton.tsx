import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, AccessibilityRole } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface AccessibleButtonProps {
  onPress: () => void
  title: string
  accessibilityLabel?: string
  accessibilityHint?: string
  icon?: keyof typeof Ionicons.glyphMap
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  style?: any
  textStyle?: any
}

export function AccessibleButton({
  onPress,
  title,
  accessibilityLabel,
  accessibilityHint,
  icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: AccessibleButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ]

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyles}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? 'white' : '#3b82f6'} 
        />
      ) : (
        <>
          {icon && (
            <Ionicons 
              name={icon} 
              size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} 
              color={variant === 'primary' ? 'white' : '#3b82f6'}
              style={styles.icon}
            />
          )}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  button_primary: {
    backgroundColor: '#3b82f6',
  },
  button_secondary: {
    backgroundColor: '#6b7280',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  button_md: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  button_lg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  button_disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  text_primary: {
    color: 'white',
  },
  text_secondary: {
    color: 'white',
  },
  text_outline: {
    color: '#3b82f6',
  },
  text_ghost: {
    color: '#3b82f6',
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 14,
  },
  text_lg: {
    fontSize: 16,
  },
  text_disabled: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 8,
  },
})
