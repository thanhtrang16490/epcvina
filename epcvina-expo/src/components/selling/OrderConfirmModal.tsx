import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { GiftItem, DiscountType } from '../../types'

interface OrderConfirmModalProps {
  visible: boolean
  customerName: string | null
  cartItems: Array<{
    name: string
    quantity: number
    price: number
    special_price?: number | null
    has_special_price?: boolean
    unit?: string | null
  }>
  giftItems: GiftItem[]
  subtotal: number
  discountType: DiscountType | null
  discountValue: number
  discountAmount: number
  finalAmount: number
  isCreating: boolean
  onConfirm: () => void
  onCancel: () => void
  formatCurrency: (amount: number) => string
}

export default function OrderConfirmModal({
  visible,
  customerName,
  cartItems,
  giftItems,
  subtotal,
  discountType,
  discountValue,
  discountAmount,
  finalAmount,
  isCreating,
  onConfirm,
  onCancel,
  formatCurrency,
}: OrderConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onCancel}
        />
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Xác nhận đơn hàng</Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentInner}>
            {/* Customer */}
            <View style={styles.section}>
              <View style={styles.sectionLabelRow}>
                <Ionicons name="person-outline" size={16} color="#6b7280" />
                <Text style={styles.sectionLabel}>Khách hàng</Text>
              </View>
              <Text style={styles.customerName}>{customerName || 'Khách lẻ'}</Text>
            </View>

            {/* Cart items summary */}
            <View style={styles.section}>
              <View style={styles.sectionLabelRow}>
                <Ionicons name="cart-outline" size={16} color="#6b7280" />
                <Text style={styles.sectionLabel}>Sản phẩm ({cartItems.length})</Text>
              </View>
              {cartItems.map((item, idx) => {
                const itemPrice = item.has_special_price && item.special_price
                  ? item.special_price
                  : item.price
                return (
                  <View key={idx} style={styles.confirmItemRow}>
                    <View style={styles.confirmItemInfo}>
                      <Text style={styles.confirmItemName} numberOfLines={1}>{item.name}</Text>
                      {item.has_special_price && item.special_price ? (
                        <View style={styles.confirmItemPriceRow}>
                          <Text style={styles.confirmItemOrigPrice}>{formatCurrency(item.price)}</Text>
                          <Text style={styles.confirmItemSpecialPrice}>{formatCurrency(item.special_price)}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.confirmItemQty}>x{item.quantity}{item.unit ? ` ${item.unit}` : ''}</Text>
                    <Text style={styles.confirmItemTotal}>{formatCurrency(itemPrice * item.quantity)}</Text>
                  </View>
                )
              })}
            </View>

            {/* Gift items */}
            {giftItems.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionLabelRow}>
                  <Ionicons name="gift-outline" size={16} color="#059669" />
                  <Text style={styles.sectionLabelGift}>Quà tặng ({giftItems.length})</Text>
                </View>
                {giftItems.map((gift, idx) => (
                  <View key={idx} style={styles.confirmItemRow}>
                    <View style={styles.confirmItemInfo}>
                      <Text style={styles.confirmItemName} numberOfLines={1}>{gift.product_name}</Text>
                      <Text style={styles.confirmGiftMeta}>
                        {gift.auto ? `Auto · ${gift.policy_name}` : 'Thủ công'}
                      </Text>
                    </View>
                    <Text style={styles.confirmItemQty}>x{gift.quantity}</Text>
                    <Text style={styles.confirmGiftTotal}>{formatCurrency(gift.unit_value * gift.quantity)}</Text>
                  </View>
                ))}
                <Text style={styles.giftNote}>(không tính vào thanh toán)</Text>
              </View>
            )}

            {/* Pricing breakdown */}
            <View style={styles.pricingSection}>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Tạm tính</Text>
                <Text style={styles.pricingValue}>{formatCurrency(subtotal)}</Text>
              </View>

              {discountAmount > 0 && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabelDiscount}>
                    Chiết khấu ({discountType === 'percentage' ? `${discountValue}%` : formatCurrency(discountValue)})
                  </Text>
                  <Text style={styles.pricingValueDiscount}>-{formatCurrency(discountAmount)}</Text>
                </View>
              )}

              <View style={[styles.pricingRow, styles.pricingRowFinal]}>
                <Text style={styles.pricingLabelFinal}>Tổng cộng</Text>
                <Text style={styles.pricingValueFinal}>{formatCurrency(finalAmount)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={isCreating}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirm}
              disabled={isCreating}
            >
              {isCreating ? (
                <Text style={styles.confirmButtonText}>Đang tạo...</Text>
              ) : (
                <View style={styles.confirmButtonContent}>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.confirmButtonText}>Xác nhận</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '92%',
    maxWidth: 500,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentInner: {
    padding: 20,
    gap: 16,
  },
  section: {
    gap: 6,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  sectionLabelGift: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  confirmItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  confirmItemInfo: {
    flex: 1,
    minWidth: 0,
  },
  confirmItemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  confirmItemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confirmItemOrigPrice: {
    fontSize: 11,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  confirmItemSpecialPrice: {
    fontSize: 11,
    fontWeight: '600',
    color: '#175ead',
  },
  confirmItemQty: {
    fontSize: 13,
    color: '#6b7280',
    minWidth: 40,
    textAlign: 'center',
  },
  confirmItemTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    minWidth: 80,
    textAlign: 'right',
  },
  confirmGiftMeta: {
    fontSize: 10,
    color: '#9ca3af',
  },
  confirmGiftTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    minWidth: 80,
    textAlign: 'right',
  },
  giftNote: {
    fontSize: 10,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  pricingSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  pricingLabelDiscount: {
    fontSize: 14,
    color: '#ef4444',
  },
  pricingValueDiscount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  pricingRowFinal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    marginTop: 4,
  },
  pricingLabelFinal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  pricingValueFinal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#175ead',
    alignItems: 'center',
  },
  confirmButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
