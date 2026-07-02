import { View, Text, TouchableOpacity, TextInput, Modal, FlatList, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState, useMemo } from 'react'
import type { GiftItem } from '../../types'

interface GiftSectionProps {
  giftItems: GiftItem[]
  products: any[]
  onRemoveManualGift: (index: number) => void
  onAddManualGift: (gift: GiftItem) => void
  formatCurrency: (amount: number) => string
}

export default function GiftSection({
  giftItems,
  products,
  onRemoveManualGift,
  onAddManualGift,
  formatCurrency,
}: GiftSectionProps) {
  const [showGiftModal, setShowGiftModal] = useState(false)
  const [giftSearchQuery, setGiftSearchQuery] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [giftQuantity, setGiftQuantity] = useState('')

  const giftSearchResults = useMemo(() => {
    if (!giftSearchQuery || giftSearchQuery.trim().length < 2) return []
    const query = giftSearchQuery.toLowerCase().trim()
    return products
      .filter(p =>
        p.name?.toLowerCase().includes(query) || p.code?.toLowerCase().includes(query)
      )
      .slice(0, 8)
  }, [products, giftSearchQuery])

  const giftTotalValue = giftItems.reduce((s, g) => s + g.unit_value * g.quantity, 0)

  const handleAddGift = () => {
    if (!selectedProductId) {
      return
    }
    const qty = parseFloat(giftQuantity)
    if (!qty || qty <= 0) {
      return
    }
    const product = products.find(p => String(p.id) === selectedProductId)
    if (!product) return

    onAddManualGift({
      policy_id: null,
      policy_name: '',
      product_id: String(product.id),
      product_name: product.name,
      product_code: product.code || '',
      quantity: qty,
      unit_value: product.price || 0,
      unit: product.unit,
      auto: false,
    })

    setGiftSearchQuery('')
    setSelectedProductId('')
    setGiftQuantity('')
    setShowGiftModal(false)
  }

  return (
    <>
      {giftItems.length > 0 && (
        <View style={styles.giftSection}>
          <View style={styles.giftHeader}>
            <Ionicons name="gift-outline" size={16} color="#059669" />
            <Text style={styles.giftHeaderText}>Quà tặng ({giftItems.length})</Text>
          </View>

          {giftItems.map((gift, idx) => (
            <View key={`${gift.product_id}-${idx}`} style={styles.giftItemRow}>
              <View style={styles.giftItemInfo}>
                <Text style={styles.giftItemName} numberOfLines={1}>{gift.product_name}</Text>
                <View style={styles.giftItemMeta}>
                  {gift.auto ? (
                    <View style={styles.autoBadge}>
                      <Text style={styles.autoBadgeText}>Auto · {gift.policy_name}</Text>
                    </View>
                  ) : (
                    <View style={styles.manualBadge}>
                      <Text style={styles.manualBadgeText}>Thủ công</Text>
                    </View>
                  )}
                  <Text style={styles.giftItemQty}>
                    x{gift.quantity}{gift.unit ? ` ${gift.unit}` : ''}
                  </Text>
                </View>
              </View>
              <View style={styles.giftItemValues}>
                <Text style={styles.giftItemUnitValue}>
                  {gift.unit_value.toLocaleString('vi-VN')}đ/sp
                </Text>
                <Text style={styles.giftItemTotalValue}>
                  {(gift.unit_value * gift.quantity).toLocaleString('vi-VN')}đ
                </Text>
              </View>
              {!gift.auto && (
                <TouchableOpacity
                  onPress={() => onRemoveManualGift(idx)}
                  style={styles.giftRemoveButton}
                >
                  <Ionicons name="close" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <View style={styles.giftTotalRow}>
            <Text style={styles.giftTotalLabel}>Tổng quà tặng (không tính vào thanh toán)</Text>
            <Text style={styles.giftTotalValue}>{formatCurrency(giftTotalValue)}</Text>
          </View>
        </View>
      )}

      {/* Add gift button */}
      <TouchableOpacity
        style={styles.addGiftButton}
        onPress={() => setShowGiftModal(true)}
      >
        <Ionicons name="add" size={14} color="#059669" />
        <Text style={styles.addGiftButtonText}>Thêm quà tặng</Text>
      </TouchableOpacity>

      {/* Gift Modal */}
      <Modal
        visible={showGiftModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGiftModal(false)}
      >
        <View style={styles.giftModalOverlay}>
          <TouchableOpacity
            style={styles.giftModalBackdrop}
            activeOpacity={1}
            onPress={() => setShowGiftModal(false)}
          />
          <View style={styles.giftModalContent}>
            <View style={styles.giftModalHeader}>
              <View style={styles.giftModalHeaderLeft}>
                <Ionicons name="gift-outline" size={20} color="#059669" />
                <Text style={styles.giftModalTitle}>Quà tặng</Text>
              </View>
              <TouchableOpacity onPress={() => setShowGiftModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Add gift form */}
            <View style={styles.giftForm}>
              <View style={styles.giftFormRow}>
                <View style={styles.giftSearchContainer}>
                  <Ionicons name="search" size={16} color="#9ca3af" style={styles.giftSearchIcon} />
                  <TextInput
                    style={styles.giftSearchInput}
                    placeholder="Tìm sản phẩm..."
                    value={selectedProductId ? products.find(p => String(p.id) === selectedProductId)?.name || giftSearchQuery : giftSearchQuery}
                    onChangeText={(text) => {
                      setGiftSearchQuery(text)
                      setSelectedProductId('')
                    }}
                    placeholderTextColor="#9ca3af"
                  />
                  {giftSearchQuery.length > 0 && !selectedProductId && (
                    <View style={styles.giftSearchResults}>
                      {giftSearchResults.map((product) => (
                        <TouchableOpacity
                          key={product.id}
                          style={styles.giftSearchResultItem}
                          onPress={() => {
                            setSelectedProductId(String(product.id))
                            setGiftSearchQuery(product.name)
                          }}
                        >
                          <Text style={styles.giftSearchResultName}>{product.name}</Text>
                          <Text style={styles.giftSearchResultCode}>{product.code}</Text>
                        </TouchableOpacity>
                      ))}
                      {giftSearchResults.length === 0 && (
                        <Text style={styles.giftSearchEmpty}>Không tìm thấy sản phẩm</Text>
                      )}
                    </View>
                  )}
                </View>
                <TextInput
                  style={styles.giftQtyInput}
                  value={giftQuantity}
                  onChangeText={setGiftQuantity}
                  placeholder="SL"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity
                  style={styles.giftAddButton}
                  onPress={handleAddGift}
                >
                  <Text style={styles.giftAddButtonText}>Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Existing gifts list */}
            <FlatList
              data={giftItems}
              keyExtractor={(_, idx) => `gift-${idx}`}
              contentContainerStyle={styles.giftList}
              ListEmptyComponent={
                <View style={styles.giftListEmpty}>
                  <Ionicons name="gift-outline" size={40} color="#d1d5db" />
                  <Text style={styles.giftListEmptyText}>Chưa có quà tặng nào</Text>
                </View>
              }
              renderItem={({ item: gift, index }) => (
                <View style={styles.giftModalItem}>
                  <View style={styles.giftItemInfo}>
                    <Text style={styles.giftItemName}>{gift.product_name}</Text>
                    <View style={styles.giftItemMeta}>
                      {gift.auto ? (
                        <View style={styles.autoBadge}>
                          <Text style={styles.autoBadgeText}>Auto · {gift.policy_name}</Text>
                        </View>
                      ) : (
                        <View style={styles.manualBadge}>
                          <Text style={styles.manualBadgeText}>Thủ công</Text>
                        </View>
                      )}
                      <Text style={styles.giftItemQty}>
                        x{gift.quantity}{gift.unit ? ` ${gift.unit}` : ''}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.giftItemValues}>
                    <Text style={styles.giftItemUnitValue}>
                      {gift.unit_value.toLocaleString('vi-VN')}đ/sp
                    </Text>
                    <Text style={styles.giftItemTotalValue}>
                      {(gift.unit_value * gift.quantity).toLocaleString('vi-VN')}đ
                    </Text>
                  </View>
                  {!gift.auto && (
                    <TouchableOpacity
                      onPress={() => onRemoveManualGift(index)}
                      style={styles.giftRemoveButton}
                    >
                      <Ionicons name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />

            {/* Footer */}
            {giftItems.length > 0 && (
              <View style={styles.giftModalFooter}>
                <View>
                  <Text style={styles.giftModalFooterLabel}>Tổng quà tặng</Text>
                  <Text style={styles.giftModalFooterValue}>{formatCurrency(giftTotalValue)}</Text>
                  <Text style={styles.giftModalFooterNote}>(không tính vào thanh toán)</Text>
                </View>
                <TouchableOpacity
                  style={styles.giftModalDoneButton}
                  onPress={() => setShowGiftModal(false)}
                >
                  <Text style={styles.giftModalDoneButtonText}>Hoàn tất</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  giftSection: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    gap: 8,
  },
  giftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  giftHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  giftItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  giftItemInfo: {
    flex: 1,
    minWidth: 0,
  },
  giftItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  giftItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  autoBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  autoBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  manualBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  manualBadgeText: {
    fontSize: 10,
    color: '#6b7280',
  },
  giftItemQty: {
    fontSize: 11,
    color: '#6b7280',
  },
  giftItemValues: {
    alignItems: 'flex-end',
    marginRight: 4,
  },
  giftItemUnitValue: {
    fontSize: 10,
    color: '#9ca3af',
  },
  giftItemTotalValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  giftRemoveButton: {
    padding: 4,
  },
  giftTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
    paddingTop: 8,
    marginTop: 4,
  },
  giftTotalLabel: {
    fontSize: 11,
    color: '#059669',
  },
  giftTotalValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  addGiftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 4,
  },
  addGiftButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
  },
  // Gift Modal styles
  giftModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  giftModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  giftModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  giftModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  giftModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  giftModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  giftForm: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  giftFormRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  giftSearchContainer: {
    flex: 1,
    position: 'relative',
  },
  giftSearchIcon: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
  },
  giftSearchInput: {
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingLeft: 32,
    paddingRight: 12,
    paddingVertical: 10,
  },
  giftSearchResults: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 160,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  giftSearchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  giftSearchResultName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  giftSearchResultCode: {
    fontSize: 11,
    color: '#9ca3af',
  },
  giftSearchEmpty: {
    padding: 12,
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
  giftQtyInput: {
    width: 60,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
    textAlign: 'center',
  },
  giftAddButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  giftAddButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  giftList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  giftListEmpty: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  giftListEmptyText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  giftModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 8,
  },
  giftModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  giftModalFooterLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  giftModalFooterValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  giftModalFooterNote: {
    fontSize: 10,
    color: '#9ca3af',
  },
  giftModalDoneButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  giftModalDoneButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
})
