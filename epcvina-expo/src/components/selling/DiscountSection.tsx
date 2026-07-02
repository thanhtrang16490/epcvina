import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { DiscountType } from '../../types'

interface DiscountSectionProps {
  discountType: DiscountType
  discountValue: number
  discountAmount: number
  discountNotes: string
  subtotal: number
  onDiscountTypeChange: (type: DiscountType) => void
  onDiscountValueChange: (value: number) => void
  onDiscountNotesChange: (notes: string) => void
  formatCurrency: (amount: number) => string
}

export default function DiscountSection({
  discountType,
  discountValue,
  discountAmount,
  discountNotes,
  subtotal,
  onDiscountTypeChange,
  onDiscountValueChange,
  onDiscountNotesChange,
  formatCurrency,
}: DiscountSectionProps) {
  return (
    <View style={styles.discountSection}>
      <View style={styles.discountHeader}>
        <Ionicons name="pricetag-outline" size={16} color="#6b7280" />
        <Text style={styles.discountHeaderText}>Chiết khấu</Text>
      </View>

      {/* Discount type selector */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, discountType === 'percentage' && styles.typeButtonActive]}
          onPress={() => onDiscountTypeChange('percentage')}
        >
          <Text style={[styles.percentIcon, discountType === 'percentage' && styles.percentIconActive]}>%</Text>
          <Text style={[styles.typeButtonText, discountType === 'percentage' && styles.typeButtonTextActive]}>
            %
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, discountType === 'fixed' && styles.typeButtonActive]}
          onPress={() => onDiscountTypeChange('fixed')}
        >
          <Text style={[styles.typeButtonText, discountType === 'fixed' && styles.typeButtonTextActive]}>
            VND
          </Text>
        </TouchableOpacity>
      </View>

      {/* Discount value input */}
      <TextInput
        style={styles.discountInput}
        value={discountValue > 0 ? discountValue.toString() : ''}
        onChangeText={(text) => onDiscountValueChange(parseFloat(text) || 0)}
        placeholder={discountType === 'percentage' ? 'Nhập % chiết khấu' : 'Nhập số tiền'}
        placeholderTextColor="#9ca3af"
        keyboardType="decimal-pad"
        maxLength={10}
      />

      {/* Discount amount display */}
      {discountAmount > 0 && (
        <View style={styles.discountAmountRow}>
          <Text style={styles.discountAmountLabel}>Giảm giá</Text>
          <Text style={styles.discountAmountValue}>-{formatCurrency(discountAmount)}</Text>
        </View>
      )}

      {/* Discount notes */}
      <TextInput
        style={styles.discountNotesInput}
        value={discountNotes}
        onChangeText={onDiscountNotesChange}
        placeholder="Ghi chú chiết khấu (tùy chọn)..."
        placeholderTextColor="#9ca3af"
        maxLength={200}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  discountSection: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    gap: 8,
  },
  discountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  discountHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  percentIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  percentIconActive: {
    color: '#175ead',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#175ead',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  typeButtonTextActive: {
    color: '#175ead',
    fontWeight: '600',
  },
  discountInput: {
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  discountAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountAmountLabel: {
    fontSize: 14,
    color: '#ef4444',
  },
  discountAmountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  discountNotesInput: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
})
