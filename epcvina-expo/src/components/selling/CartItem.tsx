import { memo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// Cart item type
export interface CartItemType {
  id: number
  name: string
  price: number
  quantity: number
  stock: number
  image_url?: string | null
  code?: string | null
  special_price?: number | null
  has_special_price?: boolean
  unit?: string | null
}

interface CartItemProps {
  item: CartItemType
  onPress: () => void
  onDecrease: (e: any) => void
  onIncrease: (e: any) => void
  formatCurrency: (amount: number) => string
}

const CartItem = memo(({
  item,
  onPress,
  onDecrease,
  onIncrease,
  formatCurrency,
}: CartItemProps) => {
  const finalPrice = item.has_special_price && item.special_price
    ? item.special_price
    : item.price
  const lineTotal = finalPrice * item.quantity

  return (
    <TouchableOpacity
      style={styles.cartItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cartItemHeader}>
        <View style={styles.cartItemInfo}>
          <Text style={styles.cartItemName}>{item.name}</Text>
          {item.has_special_price && item.special_price ? (
            <View style={styles.specialPriceRow}>
              <Text style={styles.originalPrice}>
                {formatCurrency(item.price)}
              </Text>
              <Text style={styles.specialPrice}>
                {formatCurrency(item.special_price)}
              </Text>
              <View style={styles.specialBadge}>
                <Text style={styles.specialBadgeText}>Ưu đãi</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.cartItemPrice}>{formatCurrency(item.price)}</Text>
          )}
        </View>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={onDecrease}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={16} color="#6b7280" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>
            {item.quantity}{item.unit ? ` ${item.unit}` : ''}
          </Text>

          <TouchableOpacity
            onPress={onIncrease}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.cartItemTotal}>
        Thành tiền: {formatCurrency(lineTotal)}
      </Text>
    </TouchableOpacity>
  )
})

CartItem.displayName = 'CartItem'

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#6b7280',
  },
  specialPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  originalPrice: {
    fontSize: 11,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  specialPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#175ead',
  },
  specialBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  specialBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    minWidth: 40,
    textAlign: 'center',
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#175ead',
  },
})

export default CartItem
