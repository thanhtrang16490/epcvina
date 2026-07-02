import type { DiscountType } from '../types'

/**
 * Calculate order total with discount
 */
export function calculateOrderTotal(
  subtotal: number,
  discountType: DiscountType | null,
  discountValue: number
): { discount_amount: number; total_amount: number } {
  let discount_amount = 0

  if (discountType === 'percentage') {
    discount_amount = subtotal * (discountValue / 100)
  } else if (discountType === 'fixed') {
    discount_amount = Math.min(discountValue, subtotal)
  }

  return {
    discount_amount: Math.round(discount_amount),
    total_amount: Math.round(subtotal - discount_amount),
  }
}

/**
 * Validate discount based on role
 */
export function validateDiscount(
  userRole: string,
  discountType: DiscountType,
  discountValue: number,
  subtotal: number
): { valid: boolean; error?: string } {
  // Sale can only apply max 10% discount
  if (userRole === 'sale') {
    if (discountType === 'percentage' && discountValue > 10) {
      return { valid: false, error: 'Sale chỉ được áp dụng chiết khấu tối đa 10%' }
    }
  }

  // Validate percentage discount
  if (discountType === 'percentage') {
    if (discountValue < 0 || discountValue > 100) {
      return { valid: false, error: 'Chiết khấu phần trăm phải từ 0-100' }
    }
  }

  // Validate fixed discount
  if (discountType === 'fixed') {
    if (discountValue < 0) {
      return { valid: false, error: 'Chiết khấu phải lớn hơn 0' }
    }
    if (discountValue > subtotal) {
      return { valid: false, error: 'Chiết khấu không được vượt quá tổng đơn hàng' }
    }
  }

  return { valid: true }
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  return `DH-${Date.now()}`
}
