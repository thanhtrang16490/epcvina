import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import QuickActionButton from '../QuickActionButton'

describe('QuickActionButton', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <QuickActionButton
        title="Tạo đơn hàng"
        icon="add-circle"
        color="#175ead"
        iconColor="white"
        onPress={() => {}}
      />
    )

    expect(getByText('Tạo đơn hàng')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <QuickActionButton
        title="Xem sản phẩm"
        icon="cube"
        color="#10b981"
        iconColor="white"
        onPress={onPress}
      />
    )

    fireEvent.press(getByText('Xem sản phẩm'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple presses', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <QuickActionButton
        title="Khách hàng"
        icon="people"
        color="#f59e0b"
        iconColor="white"
        onPress={onPress}
      />
    )

    const button = getByText('Khách hàng')
    fireEvent.press(button)
    fireEvent.press(button)
    fireEvent.press(button)

    expect(onPress).toHaveBeenCalledTimes(3)
  })
})
