import {
  validateCart,
  validateCustomer,
  detectGifts,
  getProductFinalPrice,
  calculateSubtotal,
  buildOrderPayload,
  buildOrderItems,
  calculateOrderTotal,
} from '../order-creation'
import * as pricing from '../pricing'
import type { GiftPolicy } from '../../types'

// Mock generateOrderNumber for deterministic tests
jest.mock('../pricing', () => {
  const actual = jest.requireActual('../pricing')
  return {
    ...actual,
    generateOrderNumber: jest.fn(() => 'DH-1234567890'),
  }
})

describe('Order Creation Business Logic', () => {
  // ─── Helpers ───────────────────────────────────────────────────────────────
  const createProduct = (id: number, name: string, price: number, stock = 100) => ({
    id,
    name,
    price,
    stock,
    unit: 'thùng',
  })

  const createCartItem = (product: any, quantity: number) => ({
    ...product,
    quantity,
  })

  const createCustomer = (id: string, name: string) => ({
    id,
    full_name: name,
    phone: '0123456789',
  })

  const createGiftPolicy = (overrides: Partial<GiftPolicy> = {}): GiftPolicy => ({
    id: 'gp-1',
    name: 'Mua 10 tặng 1',
    trigger_product_id: 1,
    min_quantity: 10,
    gift_product_id: 99,
    gift_quantity: 1,
    is_active: true,
    effective_from: '2024-01-01',
    effective_to: '2026-12-31',
    notes: null,
    created_by: null,
    created_at: '2024-01-01T00:00:00Z',
    trigger_product: { id: 1, name: 'Sản phẩm A', code: 'SP-A' },
    gift_product: { id: 99, name: 'Quà tặng A', code: 'QT-A', price: 50000, unit: 'hộp' },
    ...overrides,
  })

  // ─── Cart Validation ───────────────────────────────────────────────────────
  describe('validateCart', () => {
    it('should reject empty cart', () => {
      const result = validateCart([])
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Vui lòng thêm sản phẩm vào đơn hàng')
    })

    it('should accept cart with items all quantities > 0', () => {
      const cart = [
        createCartItem(createProduct(1, 'Sản phẩm A', 150000), 2),
        createCartItem(createProduct(2, 'Sản phẩm B', 300000), 3),
      ]
      const result = validateCart(cart)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject cart with zero quantity item', () => {
      const cart = [
        createCartItem(createProduct(1, 'Sản phẩm A', 150000), 2),
        createCartItem(createProduct(2, 'Sản phẩm B', 300000), 0),
      ]
      const result = validateCart(cart)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Số lượng sản phẩm phải lớn hơn 0')
    })

    it('should reject cart with negative quantity item', () => {
      const cart = [createCartItem(createProduct(1, 'Sản phẩm A', 150000), -1)]
      const result = validateCart(cart)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Số lượng sản phẩm phải lớn hơn 0')
    })
  })

  // ─── Customer Validation ───────────────────────────────────────────────────
  describe('validateCustomer', () => {
    it('should reject when no customer selected', () => {
      const result = validateCustomer(null)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Vui lòng chọn khách hàng')
    })

    it('should reject when customer has no id', () => {
      const result = validateCustomer({ full_name: 'Test' })
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Vui lòng chọn khách hàng')
    })

    it('should accept when customer is selected', () => {
      const customer = createCustomer('cust-1', 'Nguyễn Văn A')
      const result = validateCustomer(customer)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  // ─── Discount Application Logic ────────────────────────────────────────────
  describe('calculateOrderTotal', () => {
    it('should apply percentage discount correctly', () => {
      const subtotal = 1000000
      const result = calculateOrderTotal(subtotal, 'percentage', 10)
      expect(result.discount_amount).toBe(100000)
      expect(result.total_amount).toBe(900000)
    })

    it('should apply fixed discount correctly', () => {
      const subtotal = 1000000
      const result = calculateOrderTotal(subtotal, 'fixed', 150000)
      expect(result.discount_amount).toBe(150000)
      expect(result.total_amount).toBe(850000)
    })

    it('should cap fixed discount when discount > subtotal', () => {
      const subtotal = 100000
      const result = calculateOrderTotal(subtotal, 'fixed', 200000)
      expect(result.discount_amount).toBe(100000)
      expect(result.total_amount).toBe(0)
    })

    it('should return subtotal as total when no discount', () => {
      const subtotal = 1500000
      const result = calculateOrderTotal(subtotal, null, 0)
      expect(result.discount_amount).toBe(0)
      expect(result.total_amount).toBe(1500000)
    })

    it('should handle realistic VND amounts with percentage discount', () => {
      const subtotal = 3500000 // 2 items at 1.75M each
      const result = calculateOrderTotal(subtotal, 'percentage', 5)
      expect(result.discount_amount).toBe(175000)
      expect(result.total_amount).toBe(3325000)
    })

    it('should handle realistic VND amounts with fixed discount', () => {
      const subtotal = 4500000
      const result = calculateOrderTotal(subtotal, 'fixed', 500000)
      expect(result.discount_amount).toBe(500000)
      expect(result.total_amount).toBe(4000000)
    })
  })

  // ─── Gift Policy Detection Logic ───────────────────────────────────────────
  describe('detectGifts', () => {
    it('should detect gift when cart has trigger product with quantity >= min_quantity', () => {
      const cart = [createCartItem(createProduct(1, 'Sản phẩm A', 150000), 10)]
      const policies = [createGiftPolicy()]
      const gifts = detectGifts(cart, policies, '2025-06-01')

      expect(gifts).toHaveLength(1)
      expect(gifts[0].policy_id).toBe('gp-1')
      expect(gifts[0].quantity).toBe(1)
      expect(gifts[0].auto).toBe(true)
    })

    it('should not detect gift when trigger product quantity < min_quantity', () => {
      const cart = [createCartItem(createProduct(1, 'Sản phẩm A', 150000), 5)]
      const policies = [createGiftPolicy()]
      const gifts = detectGifts(cart, policies, '2025-06-01')

      expect(gifts).toHaveLength(0)
    })

    it('should apply multiple gifts from same policy based on quantity multiplier', () => {
      const cart = [createCartItem(createProduct(1, 'Sản phẩm A', 150000), 25)]
      const policies = [createGiftPolicy()]
      const gifts = detectGifts(cart, policies, '2025-06-01')

      expect(gifts).toHaveLength(1)
      expect(gifts[0].quantity).toBe(2) // floor(25 / 10) = 2
    })

    it('should not apply expired gift policy', () => {
      const cart = [createCartItem(createProduct(1, 'Sản phẩm A', 150000), 10)]
      const policies = [
        createGiftPolicy({
          effective_from: '2023-01-01',
          effective_to: '2023-12-31',
        }),
      ]
      const gifts = detectGifts(cart, policies, '2025-06-01')

      expect(gifts).toHaveLength(0)
    })

    it('should not apply future gift policy', () => {
      const cart = [createCartItem(createProduct(1, 'Sản phẩm A', 150000), 10)]
      const policies = [
        createGiftPolicy({
          effective_from: '2027-01-01',
          effective_to: '2027-12-31',
        }),
      ]
      const gifts = detectGifts(cart, policies, '2025-06-01')

      expect(gifts).toHaveLength(0)
    })

    it('should handle multiple gift policies independently', () => {
      const cart = [
        createCartItem(createProduct(1, 'Sản phẩm A', 150000), 10),
        createCartItem(createProduct(2, 'Sản phẩm B', 300000), 20),
      ]
      const policies = [
        createGiftPolicy({
          id: 'gp-1',
          trigger_product_id: 1,
          gift_product_id: 99,
          min_quantity: 10,
          gift_quantity: 1,
        }),
        createGiftPolicy({
          id: 'gp-2',
          name: 'Mua 20 tặng 2',
          trigger_product_id: 2,
          gift_product_id: 88,
          min_quantity: 20,
          gift_quantity: 2,
          trigger_product: { id: 2, name: 'Sản phẩm B', code: 'SP-B' },
          gift_product: { id: 88, name: 'Quà tặng B', code: 'QT-B', price: 75000, unit: 'chai' },
        }),
      ]
      const gifts = detectGifts(cart, policies, '2025-06-01')

      expect(gifts).toHaveLength(2)
      expect(gifts[0].quantity).toBe(1)
      expect(gifts[1].quantity).toBe(2)
    })

    it('should match trigger product by string id comparison', () => {
      const cart = [createCartItem(createProduct('1', 'Sản phẩm A', 150000), 10)]
      const policies = [createGiftPolicy({ trigger_product_id: 1 })]
      const gifts = detectGifts(cart, policies, '2025-06-01')

      expect(gifts).toHaveLength(1)
    })
  })

  // ─── Special Pricing Logic ─────────────────────────────────────────────────
  describe('getProductFinalPrice', () => {
    it('should use special price when customer has special price for product', () => {
      const product = createProduct(1, 'Sản phẩm A', 500000)
      const specialPrices = new Map([['1', 450000]])

      const price = getProductFinalPrice(product, specialPrices)
      expect(price).toBe(450000)
    })

    it('should use default product price when no special price', () => {
      const product = createProduct(1, 'Sản phẩm A', 500000)
      const specialPrices = new Map()

      const price = getProductFinalPrice(product, specialPrices)
      expect(price).toBe(500000)
    })

    it('should handle string id products with numeric special prices map', () => {
      const product = createProduct('abc-123', 'Sản phẩm A', 300000)
      const specialPrices = new Map([['abc-123', 270000]])

      const price = getProductFinalPrice(product, specialPrices)
      expect(price).toBe(270000)
    })
  })

  describe('calculateSubtotal', () => {
    it('should calculate subtotal with all normal prices', () => {
      const cart = [
        createCartItem(createProduct(1, 'Sản phẩm A', 150000), 2),
        createCartItem(createProduct(2, 'Sản phẩm B', 300000), 1),
      ]
      const specialPrices = new Map()

      const subtotal = calculateSubtotal(cart, specialPrices)
      expect(subtotal).toBe(150000 * 2 + 300000 * 1) // 600000
    })

    it('should calculate subtotal with mixed special and normal prices', () => {
      const cart = [
        createCartItem(createProduct(1, 'Sản phẩm A', 500000), 3), // special: 450000
        createCartItem(createProduct(2, 'Sản phẩm B', 300000), 2), // normal
        createCartItem(createProduct(3, 'Sản phẩm C', 200000), 1), // special: 180000
      ]
      const specialPrices = new Map([
        ['1', 450000],
        ['3', 180000],
      ])

      const subtotal = calculateSubtotal(cart, specialPrices)
      // 450000 * 3 + 300000 * 2 + 180000 * 1 = 1350000 + 600000 + 180000 = 2130000
      expect(subtotal).toBe(2130000)
    })

    it('should handle empty cart', () => {
      const subtotal = calculateSubtotal([], new Map())
      expect(subtotal).toBe(0)
    })
  })

  // ─── Order Data Structure ──────────────────────────────────────────────────
  describe('buildOrderPayload', () => {
    it('should generate order with correct fields', () => {
      const customer = createCustomer('cust-1', 'Nguyễn Văn A')
      const payload = buildOrderPayload({
        customer,
        saleId: 'sale-1',
        subtotal: 1500000,
        discountType: 'percentage',
        discountValue: 10,
        discountAmount: 150000,
        discountNotes: 'Chiết khấu khuyến mãi',
        totalAmount: 1350000,
      })

      expect(payload.customer_id).toBe('cust-1')
      expect(payload.sale_id).toBe('sale-1')
      expect(payload.status).toBe('draft')
      expect(payload.subtotal).toBe(1500000)
      expect(payload.discount_type).toBe('percentage')
      expect(payload.discount_value).toBe(10)
      expect(payload.discount_amount).toBe(150000)
      expect(payload.discount_notes).toBe('Chiết khấu khuyến mãi')
      expect(payload.total_amount).toBe(1350000)
      expect(payload.order_number).toBe('DH-1234567890')
    })

    it('should handle order without discount', () => {
      const customer = createCustomer('cust-2', 'Trần Thị B')
      const payload = buildOrderPayload({
        customer,
        saleId: 'sale-1',
        subtotal: 2000000,
        discountType: 'percentage',
        discountValue: 0,
        discountAmount: 0,
        discountNotes: '',
        totalAmount: 2000000,
      })

      expect(payload.discount_type).toBeNull()
      expect(payload.discount_value).toBeNull()
      expect(payload.discount_amount).toBeNull()
      expect(payload.total_amount).toBe(2000000)
    })

    it('should handle walk-in customer (no customer)', () => {
      const payload = buildOrderPayload({
        customer: null,
        saleId: 'sale-1',
        subtotal: 500000,
        discountType: null,
        discountValue: 0,
        discountAmount: 0,
        discountNotes: '',
        totalAmount: 500000,
      })

      expect(payload.customer_id).toBeNull()
    })

    it('should include notes when provided', () => {
      const payload = buildOrderPayload({
        customer: null,
        saleId: 'sale-1',
        subtotal: 500000,
        discountType: null,
        discountValue: 0,
        discountAmount: 0,
        discountNotes: '',
        totalAmount: 500000,
        notes: 'Giao hàng nhanh',
      })

      expect(payload.notes).toBe('Giao hàng nhanh')
    })

    it('should not include notes when empty or whitespace', () => {
      const payload = buildOrderPayload({
        customer: null,
        saleId: 'sale-1',
        subtotal: 500000,
        discountType: null,
        discountValue: 0,
        discountAmount: 0,
        discountNotes: '',
        totalAmount: 500000,
        notes: '   ',
      })

      expect(payload.notes).toBeUndefined()
    })
  })

  describe('buildOrderItems', () => {
    it('should build order items with correct fields', () => {
      const cart = [
        createCartItem(createProduct(1, 'Sản phẩm A', 150000), 2),
        createCartItem(createProduct(2, 'Sản phẩm B', 300000), 1),
      ]
      const specialPrices = new Map()

      const items = buildOrderItems(cart, specialPrices)

      expect(items).toHaveLength(2)
      expect(items[0]).toEqual({
        product_id: 1,
        quantity: 2,
        price_at_order: 150000,
      })
      expect(items[1]).toEqual({
        product_id: 2,
        quantity: 1,
        price_at_order: 300000,
      })
    })

    it('should use special prices in order items when applicable', () => {
      const cart = [
        createCartItem(createProduct(1, 'Sản phẩm A', 500000), 3),
        createCartItem(createProduct(2, 'Sản phẩm B', 300000), 2),
      ]
      const specialPrices = new Map([['1', 450000]])

      const items = buildOrderItems(cart, specialPrices)

      expect(items[0].price_at_order).toBe(450000)
      expect(items[1].price_at_order).toBe(300000)
    })

    it('should handle empty cart', () => {
      const items = buildOrderItems([], new Map())
      expect(items).toHaveLength(0)
    })
  })
})
