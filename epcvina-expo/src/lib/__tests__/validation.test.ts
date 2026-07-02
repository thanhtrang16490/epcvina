import { validateEmail, validatePhone, validatePassword } from '../validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct phone number', () => {
      expect(validatePhone('0123456789')).toBe(true)
      expect(validatePhone('0987654321')).toBe(true)
    })

    it('should reject invalid phone number', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('abcdefghij')).toBe(false)
      expect(validatePhone('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      expect(validatePassword('Password123!')).toBe(true)
      expect(validatePassword('MyP@ssw0rd')).toBe(true)
    })

    it('should reject weak password', () => {
      expect(validatePassword('short')).toBe(false)
      expect(validatePassword('12345678')).toBe(false)
      expect(validatePassword('password')).toBe(false)
      expect(validatePassword('')).toBe(false)
    })
  })
})
