export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const validators = {
  email: (value: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      return { isValid: false, error: 'Email là bắt buộc' }
    }
    if (!emailRegex.test(value)) {
      return { isValid: false, error: 'Email không hợp lệ' }
    }
    return { isValid: true }
  },

  phone: (value: string): ValidationResult => {
    const phoneRegex = /^[0-9]{10,11}$/
    if (!value) {
      return { isValid: false, error: 'Số điện thoại là bắt buộc' }
    }
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return { isValid: false, error: 'Số điện thoại không hợp lệ (10-11 số)' }
    }
    return { isValid: true }
  },

  password: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, error: 'Mật khẩu là bắt buộc' }
    }
    if (value.length < 6) {
      return { isValid: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' }
    }
    return { isValid: true }
  },

  required: (value: string, fieldName = 'Trường này'): ValidationResult => {
    if (!value || value.trim() === '') {
      return { isValid: false, error: `${fieldName} là bắt buộc` }
    }
    return { isValid: true }
  },

  minLength: (value: string, min: number, fieldName = 'Trường này'): ValidationResult => {
    if (value.length < min) {
      return { isValid: false, error: `${fieldName} phải có ít nhất ${min} ký tự` }
    }
    return { isValid: true }
  },

  maxLength: (value: string, max: number, fieldName = 'Trường này'): ValidationResult => {
    if (value.length > max) {
      return { isValid: false, error: `${fieldName} không được vượt quá ${max} ký tự` }
    }
    return { isValid: true }
  },

  number: (value: string, fieldName = 'Trường này'): ValidationResult => {
    if (isNaN(Number(value))) {
      return { isValid: false, error: `${fieldName} phải là số` }
    }
    return { isValid: true }
  },

  positiveNumber: (value: string, fieldName = 'Trường này'): ValidationResult => {
    const num = Number(value)
    if (isNaN(num) || num <= 0) {
      return { isValid: false, error: `${fieldName} phải là số dương` }
    }
    return { isValid: true }
  },

  confirmPassword: (password: string, confirmPassword: string): ValidationResult => {
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Mật khẩu xác nhận không khớp' }
    }
    return { isValid: true }
  },
}

/**
 * Standalone boolean validators (for use in tests and simple checks)
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !!email && emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10,11}$/
  return !!phone && phoneRegex.test(phone.replace(/\s/g, ''))
}

export function validatePassword(password: string): boolean {
  if (!password || password.length < 8) return false
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  return hasUppercase && hasLowercase && hasNumberOrSpecial
}

export function validateField(value: string, rules: ValidationRule[]): ValidationResult {
  for (const rule of rules) {
    if (rule.required && !value) {
      return { isValid: false, error: rule.message || 'Trường này là bắt buộc' }
    }

    if (rule.minLength && value.length < rule.minLength) {
      return { 
        isValid: false, 
        error: rule.message || `Phải có ít nhất ${rule.minLength} ký tự` 
      }
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return { 
        isValid: false, 
        error: rule.message || `Không được vượt quá ${rule.maxLength} ký tự` 
      }
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return { isValid: false, error: rule.message || 'Định dạng không hợp lệ' }
    }

    if (rule.custom && !rule.custom(value)) {
      return { isValid: false, error: rule.message || 'Giá trị không hợp lệ' }
    }
  }

  return { isValid: true }
}
