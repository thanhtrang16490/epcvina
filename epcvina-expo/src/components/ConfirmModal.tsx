import React, { useEffect, useRef } from 'react'
import { Modal, View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface ConfirmModalProps {
  visible: boolean
  title: string
  message: string
  onClose: () => void
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export default function ConfirmModal({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger',
  loading = false
}: ConfirmModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const iconAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Animate modal scale
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start()

      // Animate icon
      Animated.sequence([
        Animated.delay(200),
        Animated.spring(iconAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      scaleAnim.setValue(0)
      iconAnim.setValue(0)
    }
  }, [visible])

  const getIconConfig = () => {
    switch (type) {
      case 'danger':
        return {
          name: 'alert-circle' as const,
          color: '#ef4444',
          bg: '#fee2e2'
        }
      case 'warning':
        return {
          name: 'warning' as const,
          color: '#f59e0b',
          bg: '#fef3c7'
        }
      case 'info':
        return {
          name: 'information-circle' as const,
          color: '#3b82f6',
          bg: '#dbeafe'
        }
    }
  }

  const iconConfig = getIconConfig()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: iconAnim }]
              }
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
              <Ionicons name={iconConfig.name} size={48} color={iconConfig.color} />
            </View>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                type === 'danger' && styles.dangerButton,
                loading && styles.buttonDisabled
              ]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Đang xử lý...' : confirmText}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={loading}
          >
            <Ionicons name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
