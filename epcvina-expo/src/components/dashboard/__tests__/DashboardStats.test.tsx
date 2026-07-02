import React from 'react'
import { render } from '@testing-library/react-native'
import DashboardStats from '../DashboardStats'

describe('DashboardStats', () => {
  const mockStats = {
    orderedCount: 25,
    lowStockCount: 5,
    customerCount: 100,
    totalRevenue: 15000000,
  }

  it('should render all stat cards', () => {
    const { getByText } = render(<DashboardStats stats={mockStats} />)

    expect(getByText('Thống kê')).toBeTruthy()
    expect(getByText('Đơn hàng')).toBeTruthy()
    expect(getByText('Sản phẩm sắp hết')).toBeTruthy()
    expect(getByText('Khách hàng')).toBeTruthy()
    expect(getByText('Doanh thu')).toBeTruthy()
  })

  it('should display correct values', () => {
    const { getByText } = render(<DashboardStats stats={mockStats} />)

    expect(getByText('25')).toBeTruthy()
    expect(getByText('5')).toBeTruthy()
    expect(getByText('100')).toBeTruthy()
    // Revenue is formatted as currency
    expect(getByText(/15\.000\.000/)).toBeTruthy()
  })

  it('should handle zero values', () => {
    const zeroStats = {
      orderedCount: 0,
      lowStockCount: 0,
      customerCount: 0,
      totalRevenue: 0,
    }

    const { getAllByText } = render(<DashboardStats stats={zeroStats} />)

    // Should have multiple "0" texts
    const zeros = getAllByText('0')
    expect(zeros.length).toBeGreaterThan(0)
  })

  it('should format large revenue correctly', () => {
    const largeStats = {
      ...mockStats,
      totalRevenue: 1234567890,
    }

    const { getByText } = render(<DashboardStats stats={largeStats} />)

    // Should format with dots as thousand separators
    expect(getByText(/1\.234\.567\.890/)).toBeTruthy()
  })
})
