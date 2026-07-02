import type { GiftPolicy, GiftItem, DiscountType } from '../types'
import { calculateOrderTotal, generateOrderNumber } from './pricing'

/**
 * Validate cart before order creation
 */
export function validateCart(cart: any[]): { valid: boolean; error?: string } {
  if (cart.length === 0) {
    return { valid: false, error: 'Vui lòng thêm sản phẩm vào đơn hàng' }
  }
  if (cart.some((item) => item.quantity <= 0)) {
    return { valid: false, error: 'Số lượng sản phẩm phải lớn hơn 0' }
  }
  return { valid: true }
}

/**
 * Validate customer selection before order creation
 */
export function validateCustomer(customer: any | null): { valid: boolean; error?: string } {
  if (!customer || !customer.id) {
    return { valid: false, error: 'Vui lòng chọn khách hàng' }
  }
  return { valid: true }
}

/**
 * Auto-detect gift items based on cart contents and active gift policies
 * Extracted from selling.tsx useEffect
 */
export function detectGifts(
  cart: any[],
  giftPolicies: GiftPolicy[],
  today: string = new Date().toISOString().split('T')[0]
): GiftItem[] {
  const autoGifts: GiftItem[] = []

  for (const policy of giftPolicies) {
    if (policy.effective_from && policy.effective_from > today) continue
    if (policy.effective_to && policy.effective_to < today) continue

    const cartItem = cart.find((item) => String(item.id) === String(policy.trigger_product_id))
    if (!cartItem || !policy.min_quantity || cartItem.quantity < policy.min_quantity) continue

    const multiplier = Math.floor(cartItem.quantity / policy.min_quantity)

    autoGifts.push({
      policy_id: policy.id,
      policy_name: policy.name,
      product_id: String(policy.gift_product_id),
      product_name: policy.gift_product?.name || '',
      product_code: policy.gift_product?.code || '',
      quantity: (policy.gift_quantity ?? 0) * multiplier,
      unit_value: policy.gift_product?.price || 0,
      unit: policy.gift_product?.unit,
      auto: true,
    })
  }

  return autoGifts
}

/**
 * Get final price for a product considering special pricing
 * Extracted from selling.tsx getProductFinalPrice
 */
export function getProductFinalPrice(product: any, specialPrices: Map<string, number>): number {
  if (specialPrices.has(String(product.id))) {
    return specialPrices.get(String(product.id))!
  }
  return product.price
}

/**
 * Calculate subtotal using special prices when applicable
 * Extracted from selling.tsx subtotal useMemo
 */
export function calculateSubtotal(cart: any[], specialPrices: Map<string, number>): number {
  return cart.reduce((sum, item) => {
    const price = getProductFinalPrice(item, specialPrices)
    return sum + price * item.quantity
  }, 0)
}

/**
 * Build order payload for database insert
 * Extracted from selling.tsx handleConfirmOrder
 */
export interface OrderPayload {
  customer_id: string | null
  sale_id: string | undefined
  status: 'draft'
  order_number: string
  subtotal: number
  discount_type: DiscountType | null
  discount_value: number | null
  discount_amount: number | null
  discount_notes: string | null
  total_amount: number
  notes?: string
}

export function buildOrderPayload(params: {
  customer: any | null
  saleId: string | undefined
  subtotal: number
  discountType: DiscountType | null
  discountValue: number
  discountAmount: number
  discountNotes: string
  totalAmount: number
  notes?: string
}): OrderPayload {
  const {
    customer,
    saleId,
    subtotal,
    discountType,
    discountValue,
    discountAmount,
    discountNotes,
    totalAmount,
    notes,
  } = params

  return {
    customer_id: customer?.id || null,
    sale_id: saleId,
    status: 'draft',
    order_number: generateOrderNumber(),
    subtotal,
    discount_type: discountValue > 0 ? discountType : null,
    discount_value: discountValue > 0 ? discountValue : null,
    discount_amount: discountValue > 0 ? discountAmount : null,
    discount_notes: discountNotes || null,
    total_amount: totalAmount,
    ...(notes?.trim() ? { notes: notes.trim() } : {}),
  }
}

/**
 * Build order items payload for database insert
 * Extracted from selling.tsx handleConfirmOrder
 */
export interface OrderItemPayload {
  product_id: string | number
  quantity: number
  price_at_order: number
}

export function buildOrderItems(cart: any[], specialPrices: Map<string, number>): OrderItemPayload[] {
  return cart.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    price_at_order: getProductFinalPrice(item, specialPrices),
  }))
}

// Re-export calculateOrderTotal for convenience in tests
export { calculateOrderTotal }
