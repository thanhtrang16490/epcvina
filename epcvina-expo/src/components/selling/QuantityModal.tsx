import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Image } from 'react-native'
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
}

interface QuantityModalProps {
  visible: boolean
  item: CartItemType | null
  tempQuantity: string
  onTempQuantityChange: (value: string) => void
  onSubmit: () => void
  onDelete: () => void
  onClose: () => void
  formatCurrency: (amount: number) => string
}

export default function QuantityModal({
  visible,
  item,
  tempQuantity,
  onTempQuantityChange,
  onSubmit,
  onDelete,
  onClose,
  formatCurrency,
}: QuantityModalProps) {
  const quantity = parseInt(tempQuantity) || 0

  const handleDecrease = () => {
    if (quantity > 1) {
      onTempQuantityChange((quantity - 1).toString())
    }
  }

  const handleIncrease = () => {
    if (item && quantity < item.stock) {
      onTempQuantityChange((quantity + 1).toString())
    }
  }

  if (!item) return null

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Nhập số lượng</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Product Image */}
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="cube" size={64} color="#175ead" />
              </View>
            )}

            {/* Product Info */}
            <View style={styles.info}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                <Text style={styles.priceUnit}> / sản phẩm</Text>
              </View>
              <View style={styles.stockBadge}>
                <Ionicons name="cube-outline" size={14} color="#6b7280" />
                <Text style={styles.stockText}>Tồn kho: {item.stock}</Text>
              </View>
            </View>

            {/* Quantity Controls */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleDecrease}
              >
                <Ionicons name="remove" size={24} color="white" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                value={tempQuantity}
                onChangeText={onTempQuantityChange}
                keyboardType="number-pad"
                selectTextOnFocus
                autoFocus
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleIncrease}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Total Amount */}
            <View style={styles.total}>
              <Text style={styles.totalLabel}>Thành tiền</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(item.price * quantity)}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={onDelete}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                <Text style={styles.deleteText}>Xóa</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={onSubmit}
              >
                <Text style={styles.submitText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
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
  body: {
    padding: 24,
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#f3f4f6',
  },
  imagePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#175ead',
  },
  priceUnit: {
    fontSize: 13,
    color: '#6b7280',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
  },
  stockText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  button: {
    width: 48,
    height: 48,
    backgroundColor: '#175ead',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#175ead',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    width: 100,
    height: 60,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#175ead',
  },
  total: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#dbeafe',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingVertical: 16,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#175ead',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})

