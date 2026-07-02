import React, { Component, ErrorInfo, ReactNode } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error.message)
    if (__DEV__) {
      console.error('[ErrorBoundary] Stack:', error.stack)
      console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack)
    }
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    try {
      router.replace('/(auth)/login')
    } catch {
      // fallback nếu router chưa sẵn sàng
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={64} color="#ef4444" />
              </View>

              {/* Title */}
              <Text style={styles.title}>Đã xảy ra lỗi</Text>
              <Text style={styles.message}>
                Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại hoặc quay về trang chủ.
              </Text>

              {/* Error details (DEV only) */}
              {__DEV__ && this.state.error && (
                <View style={styles.errorDetails}>
                  <View style={styles.errorHeader}>
                    <Ionicons name="bug" size={14} color="#991b1b" />
                    <Text style={styles.errorLabel}>Chi tiết lỗi (DEV)</Text>
                  </View>
                  <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                  {this.state.errorInfo?.componentStack && (
                    <Text style={styles.stackText} numberOfLines={8}>
                      {this.state.errorInfo.componentStack.trim()}
                    </Text>
                  )}
                </View>
              )}

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.primaryButton} onPress={this.handleReset}>
                  <Ionicons name="refresh" size={18} color="white" />
                  <Text style={styles.primaryButtonText}>Thử lại</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={this.handleGoHome}>
                  <Ionicons name="home-outline" size={18} color="#374151" />
                  <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fee2e2',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  errorDetails: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  errorLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991b1b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 12,
    color: '#991b1b',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  stackText: {
    fontSize: 10,
    color: '#b91c1c',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
})
