import { calculateOrderTotal, validateDiscount, generateOrderNumber } from '../pricing'

describe('Pricing Logic', () => {
  describe('calculateOrderTotal', () => {
    it('tính chiết khấu phần trăm (10% của 1.000.000 = 100.000)', () => {
      const result = calculateOrderTotal(1_000_000, 'percentage', 10)
      expect(result.discount_amount).toBe(100_000)
      expect(result.total_amount).toBe(900_000)
    })

    it('tính chiết khấu cố định (200.000 off 1.000.000 = 800.000)', () => {
      const result = calculateOrderTotal(1_000_000, 'fixed', 200_000)
      expect(result.discount_amount).toBe(200_000)
      expect(result.total_amount).toBe(800_000)
    })

    it('không có chiết khấu → tổng bằng tạm tính', () => {
      const result = calculateOrderTotal(1_000_000, null, 0)
      expect(result.discount_amount).toBe(0)
      expect(result.total_amount).toBe(1_000_000)
    })

    it('chiết khấu cố định vượt quá tạm tính → giới hạn bằng tạm tính (tổng = 0)', () => {
      const result = calculateOrderTotal(500_000, 'fixed', 1_000_000)
      expect(result.discount_amount).toBe(500_000)
      expect(result.total_amount).toBe(0)
    })

    it('xử lý số tiền lớn (VND)', () => {
      const result = calculateOrderTotal(10_000_000, 'percentage', 15)
      expect(result.discount_amount).toBe(1_500_000)
      expect(result.total_amount).toBe(8_500_000)
    })

    it('xử lý giá trị âm một cách an toàn', () => {
      const result = calculateOrderTotal(-100_000, 'percentage', 10)
      expect(result.discount_amount).toBe(-10_000)
      expect(result.total_amount).toBe(-90_000)
    })
  })

  describe('validateDiscount', () => {
    it('vai trò sale: chiết khấu 10% là hợp lệ', () => {
      const result = validateDiscount('sale', 'percentage', 10, 1_000_000)
      expect(result.valid).toBe(true)
    })

    it('vai trò sale: chiết khấu 11% là không hợp lệ', () => {
      const result = validateDiscount('sale', 'percentage', 11, 1_000_000)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Sale chỉ được áp dụng chiết khấu tối đa 10%')
    })

    it('sale_admin không bị giới hạn chiết khấu', () => {
      const result = validateDiscount('sale_admin', 'percentage', 50, 1_000_000)
      expect(result.valid).toBe(true)
    })

    it('admin không bị giới hạn chiết khấu', () => {
      const result = validateDiscount('admin', 'percentage', 50, 1_000_000)
      expect(result.valid).toBe(true)
    })

    it('phần trăm âm → không hợp lệ', () => {
      const result = validateDiscount('sale', 'percentage', -5, 1_000_000)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Chiết khấu phần trăm phải từ 0-100')
    })

    it('phần trăm > 100 → không hợp lệ', () => {
      const result = validateDiscount('admin', 'percentage', 110, 1_000_000)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Chiết khấu phần trăm phải từ 0-100')
    })

    it('chiết khấu cố định vượt quá tạm tính → không hợp lệ', () => {
      const result = validateDiscount('sale', 'fixed', 2_000_000, 1_000_000)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Chiết khấu không được vượt quá tổng đơn hàng')
    })

    it('chiết khấu bằng 0 → hợp lệ', () => {
      const result = validateDiscount('sale', 'fixed', 0, 1_000_000)
      expect(result.valid).toBe(true)
    })
  })

  describe('generateOrderNumber', () => {
    it('trả về chuỗi bắt đầu bằng "DH-"', () => {
      const orderNumber = generateOrderNumber()
      expect(orderNumber.startsWith('DH-')).toBe(true)
    })

    it('chứa timestamp', () => {
      const before = Date.now()
      const orderNumber = generateOrderNumber()
      const after = Date.now()
      const timestamp = parseInt(orderNumber.replace('DH-', ''), 10)
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })

    it('mã đơn hàng là duy nhất khi gọi liên tiếp', () => {
      let mockTime = 1_000_000
      jest.spyOn(Date, 'now').mockImplementation(() => {
        mockTime += 1
        return mockTime
      })

      const order1 = generateOrderNumber()
      const order2 = generateOrderNumber()
      expect(order1).not.toBe(order2)

      jest.restoreAllMocks()
    })
  })
})
