import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ValidationResult } from '../lib/validation'

interface ValidatedInputProps extends TextInputProps {
  label?: string
  error?: string
  validate?: (value: string) => ValidationResult
  onValidate?: (result: ValidationResult) => void
  required?: boolean
  containerStyle?: any
}

export function ValidatedInput({
  label,
  error,
  validate,
  onValidate,
  required,
  containerStyle,
  ...props
}: ValidatedInputProps) {
  const [localError, setLocalError] = useState<string>()
  const [touched, setTouched] = useState(false)

  const handleBlur = (e: any) => {
    setTouched(true)
    if (validate && props.value) {
      const result = validate(props.value as string)
      setLocalError(result.error)
      onValidate?.(result)
    }
    props.onBlur?.(e)
  }

  const displayError = error || (touched && localError)

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.inputContainer, displayError && styles.inputError]}>
        <TextInput
          {...props}
          style={[styles.input, props.style]}
          onBlur={handleBlur}
          placeholderTextColor="#9ca3af"
        />
        {displayError && (
          <Ionicons name="alert-circle" size={20} color="#ef4444" style={styles.errorIcon} />
        )}
      </View>
      {displayError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{displayError}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  errorIcon: {
    marginLeft: 8,
  },
  errorContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
  },
})
