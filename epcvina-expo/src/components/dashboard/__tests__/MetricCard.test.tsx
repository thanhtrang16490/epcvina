import React from 'react'
import { render } from '@testing-library/react-native'
import MetricCard from '../MetricCard'

describe('MetricCard', () => {
  it('should render correctly with all props', () => {
    const { getByText } = render(
      <MetricCard
        title="Đơn hàng"
        icon="cart-outline"
        value={150}
        color="#175ead"
        bg="#175ead20"
      />
    )

    expect(getByText('Đơn hàng')).toBeTruthy()
    expect(getByText('150')).toBeTruthy()
  })

  it('should render with string value', () => {
    const { getByText } = render(
      <MetricCard
        title="Doanh thu"
        icon="cash-outline"
        value="1.500.000đ"
        color="#10b981"
        bg="#10b98120"
      />
    )

    expect(getByText('Doanh thu')).toBeTruthy()
    expect(getByText('1.500.000đ')).toBeTruthy()
  })

  it('should render with zero value', () => {
    const { getByText } = render(
      <MetricCard
        title="Khách hàng"
        icon="people-outline"
        value={0}
        color="#f59e0b"
        bg="#f59e0b20"
      />
    )

    expect(getByText('Khách hàng')).toBeTruthy()
    expect(getByText('0')).toBeTruthy()
  })
})
