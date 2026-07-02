import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import RecentOrders from '../RecentOrders'

describe('RecentOrders', () => {
  const mockOrders = [
    {
      id: '1',
      order_number: 'ORD001',
      total_amount: 500000,
      status: 'pending',
      created_at: '2024-01-15T10:00:00Z',
      customers: {
        full_name: 'Nguyễn Văn A',
        phone: '0123456789',
      },
    },
    {
      id: '2',
      order_number: 'ORD002',
      total_amount: 750000,
      status: 'delivered',
      created_at: '2024-01-14T15:30:00Z',
      customers: {
        full_name: 'Trần Thị B',
        phone: '0987654321',
      },
    },
  ]

  it('should render empty state when no orders', () => {
    const { getByText } = render(
      <RecentOrders orders={[]} onOrderPress={() => {}} onViewAll={() => {}} />
    )

    expect(getByText('Đơn hàng gần đây')).toBeTruthy()
    expect(getByText('Chưa có đơn hàng nào')).toBeTruthy()
  })

  it('should render orders list', () => {
    const { getByText } = render(
      <RecentOrders orders={mockOrders} onOrderPress={() => {}} onViewAll={() => {}} />
    )

    expect(getByText('#ORD001')).toBeTruthy()
    expect(getByText('#ORD002')).toBeTruthy()
    expect(getByText('Nguyễn Văn A')).toBeTruthy()
    expect(getByText('Trần Thị B')).toBeTruthy()
  })

  it('should call onOrderPress when order is pressed', () => {
    const onOrderPress = jest.fn()
    const { getByText } = render(
      <RecentOrders orders={mockOrders} onOrderPress={onOrderPress} onViewAll={() => {}} />
    )

    fireEvent.press(getByText('#ORD001'))
    expect(onOrderPress).toHaveBeenCalledWith('1')
  })

  it('should call onViewAll when "Xem tất cả" is pressed', () => {
    const onViewAll = jest.fn()
    const { getByText } = render(
      <RecentOrders orders={mockOrders} onOrderPress={() => {}} onViewAll={onViewAll} />
    )

    fireEvent.press(getByText('Xem tất cả'))
    expect(onViewAll).toHaveBeenCalledTimes(1)
  })

  it('should format currency correctly', () => {
    const { getByText } = render(
      <RecentOrders orders={mockOrders} onOrderPress={() => {}} onViewAll={() => {}} />
    )

    // Check if currency is formatted with VND
    expect(getByText(/500\.000/)).toBeTruthy()
    expect(getByText(/750\.000/)).toBeTruthy()
  })

  it('should display status badges', () => {
    const { getByText } = render(
      <RecentOrders orders={mockOrders} onOrderPress={() => {}} onViewAll={() => {}} />
    )

    expect(getByText('Chờ xử lý')).toBeTruthy()
    expect(getByText('Đã giao')).toBeTruthy()
  })
})
