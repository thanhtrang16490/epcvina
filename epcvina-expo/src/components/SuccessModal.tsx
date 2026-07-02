import React, { useEffect, useRef } from 'react'
import { Modal, View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface SuccessModalProps {
  visible: boolean
  title: string
  message: string
  onClose: () => void
  primaryButton?: {
    text: string
    onPress: () => void
  }
  secondaryButton?: {
    text: string
    onPress: () => void
  }
}

export default function SuccessModal({
  visible,
  title,
  message,
  onClose,
  primaryButton,
  secondaryButton
}: SuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const checkAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Animate modal scale
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start()

      // Animate checkmark
      Animated.sequence([
        Animated.delay(200),
        Animated.spring(checkAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      scaleAnim.setValue(0)
      checkAnim.setValue(0)
    }
  }, [visible])

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
          {/* Success Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: checkAnim }]
              }
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={48} color="white" />
            </View>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {secondaryButton && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={secondaryButton.onPress}
              >
                <Text style={styles.secondaryButtonText}>{secondaryButton.text}</Text>
              </TouchableOpacity>
            )}
            {primaryButton && (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={primaryButton.onPress}
              >
                <Text style={styles.primaryButtonText}>{primaryButton.text}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
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
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
  primaryButton: {
    backgroundColor: '#10b981',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
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
